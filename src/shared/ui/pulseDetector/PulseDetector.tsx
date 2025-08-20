import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import FFT from 'fft.js';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import styles from './PulseDetector.module.scss';

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
);

interface PulseDetectorProps {
  /** Продолжительность окна анализа, сек */
  windowSec?: number;
  /** Целевая частота выборки (кадров в сек) */
  fps?: number;
  /** Диапазон допустимого ЧСС (уд/мин) */
  bpmRange?: { min: number; max: number };
  /** Показывать превью камеры */
  showPreview?: boolean;
  /** Callback для передачи измеренного пульса */
  onPulseDetected?: (pulse: number) => void;
  /** Текущее значение пульса из формы */
  currentValue?: number;
}

/**
 * Компонент для измерения пульса (PPG) с камеры через WebRTC.
 * ⚠️ Не медицинский прибор. Точность зависит от освещения, положения пальца/лица и качества камеры.
 */
export const PulseDetector: React.FC<PulseDetectorProps> = ({
  windowSec = 30, // Увеличено время для более точного измерения
  fps = 30,
  bpmRange = { min: 50, max: 120 }, // Сужен диапазон для лучшей точности
  showPreview = true, // Включено по умолчанию для контроля
  onPulseDetected,
  currentValue,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);

  const [bpm, setBpm] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [measuring, setMeasuring] = useState<boolean>(false);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [signalQuality, setSignalQuality] = useState<'poor' | 'fair' | 'good'>(
    'poor',
  );

  // Сырой сигнал для разных цветовых каналов
  const [, setRedSignal] = useState<number[]>([]);
  const [greenSignal, setGreenSignal] = useState<number[]>([]);
  const [processedSignal, setProcessedSignal] = useState<number[]>([]);

  const capacity = useMemo(
    () => Math.max(128, Math.round(windowSec * fps)),
    [windowSec, fps],
  );

  const start = useCallback(async () => {
    setError(null);
    setProgress(0);
    setBpm(null);
    setRedSignal([]);
    setGreenSignal([]);
    setProcessedSignal([]);
    setSignalQuality('poor');
    lastReportedBpm.current = null; // Сбрасываем последний переданный BPM

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user', // Фронтальная камера для лица
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          frameRate: { ideal: fps, min: 15 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsCameraActive(true);
        console.log('Camera started successfully');
      }
      setMeasuring(true);
    } catch (e: any) {
      console.error('Camera access error:', e);
      setError(
        `Camera access error: ${
          e?.message || 'Unknown error'
        }.\n\nTry:\n• Refresh the page\n• Allow camera access\n• Check if the camera is used by another application`,
      );
      setMeasuring(false);
      setIsCameraActive(false);
    }
  }, [fps]);

  const stop = useCallback(() => {
    console.log('Stopping measurement, current BPM:', bpm);
    setMeasuring(false);
    setIsCameraActive(false);
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, [bpm]);

  // Функция для определения области лица/кожи
  const detectSkinRegion = (
    imageData: ImageData,
    width: number,
    height: number,
  ) => {
    const data = imageData.data;
    const skinPixels = [];

    // Центральная область (предполагаем, что лицо в центре)
    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);
    const regionSize = Math.min(width, height) * 0.3; // 30% от размера

    for (let y = centerY - regionSize / 2; y < centerY + regionSize / 2; y++) {
      for (
        let x = centerX - regionSize / 2;
        x < centerX + regionSize / 2;
        x++
      ) {
        if (x >= 0 && x < width && y >= 0 && y < height) {
          const idx = (Math.floor(y) * width + Math.floor(x)) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];

          // Простой детектор кожи (HSV фильтр)
          if (isSkinColor(r, g, b)) {
            skinPixels.push({ r, g, b });
          }
        }
      }
    }

    return skinPixels;
  };

  // Простая функция определения цвета кожи
  const isSkinColor = (r: number, g: number, b: number): boolean => {
    // Конвертируем в HSV
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;

    if (max === 0) return false;

    const s = (diff / max) * 100;
    const v = (max / 255) * 100;

    let h = 0;
    if (diff !== 0) {
      if (max === r) h = ((g - b) / diff) % 6;
      else if (max === g) h = (b - r) / diff + 2;
      else h = (r - g) / diff + 4;
    }
    h = (h * 60 + 360) % 360;

    // Диапазон для кожи
    return h >= 0 && h <= 50 && s >= 20 && s <= 70 && v >= 35 && v <= 95;
  };

  // Сбор кадров с улучшенным алгоритмом
  useEffect(() => {
    if (!measuring) return;

    const w = 320;
    const h = 240;
    const startTime = Date.now();

    const ensureCanvasSize = () => {
      if (!canvasRef.current) return;
      if (canvasRef.current.width !== w) canvasRef.current.width = w;
      if (canvasRef.current.height !== h) canvasRef.current.height = h;
    };

    ensureCanvasSize();

    const intervalMs = Math.round(1000 / fps);
    timerRef.current = window.setInterval(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Рисуем кадр
      ctx.drawImage(video, 0, 0, w, h);

      // Получаем данные изображения
      const imageData = ctx.getImageData(0, 0, w, h);

      // Детектируем область кожи
      const skinPixels = detectSkinRegion(imageData, w, h);

      if (skinPixels.length < 100) {
        // Недостаточно пикселей кожи
        setSignalQuality('poor');
        return;
      }

      setSignalQuality(skinPixels.length > 500 ? 'good' : 'fair');

      // Вычисляем средние значения для каналов
      let redSum = 0,
        greenSum = 0;
      for (const pixel of skinPixels) {
        redSum += pixel.r;
        greenSum += pixel.g;
      }

      const avgRed = redSum / skinPixels.length;
      const avgGreen = greenSum / skinPixels.length;

      // Копим сигналы
      setRedSignal((prev) => {
        const next =
          prev.length >= capacity
            ? [...prev.slice(-capacity + 1), avgRed]
            : [...prev, avgRed];
        return next;
      });

      setGreenSignal((prev) => {
        const next =
          prev.length >= capacity
            ? [...prev.slice(-capacity + 1), avgGreen]
            : [...prev, avgGreen];
        return next;
      });

      // Обновляем прогресс
      const elapsed = (Date.now() - startTime) / 1000;
      const newProgress = Math.min((elapsed / windowSec) * 100, 100);
      setProgress(newProgress);

      // Останавливаем при 100%
      if (newProgress >= 100) {
        setTimeout(() => {
          stop();
        }, 1000);
      }
    }, intervalMs);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [measuring, capacity, fps, windowSec, stop]);

  // Улучшенная обработка сигнала
  useEffect(() => {
    if (greenSignal.length < capacity * 0.3 || !measuring) return; // Добавили проверку measuring

    // Обрабатываем только каждые 30 кадров, чтобы избежать бесконечного цикла
    if (greenSignal.length % 30 !== 0) return;

    console.log('Processing signal, green channel length:', greenSignal.length);

    // Используем зеленый канал (лучше для PPG)
    let signal = [...greenSignal];

    console.log(
      'Raw signal - min:',
      Math.min(...signal),
      'max:',
      Math.max(...signal),
      'mean:',
      signal.reduce((a, b) => a + b) / signal.length,
    );

    // 1) Простое удаление тренда через разности
    const detrendSignal = (arr: number[]) => {
      // Вычисляем скользящее среднее с большим окном
      const windowSize = Math.max(60, Math.floor(arr.length / 6));
      const result = [];

      for (let i = 0; i < arr.length; i++) {
        const start = Math.max(0, i - Math.floor(windowSize / 2));
        const end = Math.min(arr.length, i + Math.floor(windowSize / 2));
        const window = arr.slice(start, end);
        const mean = window.reduce((a, b) => a + b) / window.length;
        result.push(arr[i] - mean);
      }

      return result;
    };

    signal = detrendSignal(signal);
    console.log(
      'After detrend - min:',
      Math.min(...signal),
      'max:',
      Math.max(...signal),
    );

    // 2) Простая нормализация
    const mean = signal.reduce((a, b) => a + b) / signal.length;
    const std = Math.sqrt(
      signal.reduce((s, v) => s + (v - mean) ** 2, 0) / signal.length,
    );
    if (std > 0) {
      signal = signal.map((v) => (v - mean) / std);
    }

    setProcessedSignal(signal);
    console.log(
      'Normalized signal - min:',
      Math.min(...signal),
      'max:',
      Math.max(...signal),
    );

    // 3) FFT анализ
    const N = 1 << Math.floor(Math.log2(signal.length));
    console.log('FFT size:', N, 'of', signal.length, 'points');
    if (N < 32) {
      console.log('Too little data for FFT');
      return;
    }

    // Окно Хэмминга
    const windowed = signal
      .slice(-N)
      .map((v, i) => v * (0.54 - 0.46 * Math.cos((2 * Math.PI * i) / (N - 1))));

    const fft = new FFT(N);
    const re = windowed.slice();
    const im = new Array(N).fill(0);
    fft.transform(re, im);

    // Спектральная плотность мощности
    const psd = re.slice(0, N / 2).map((r, i) => (r * r + im[i] * im[i]) / N);

    // Частоты
    const freqs = new Array(N / 2).fill(0).map((_, i) => (i * fps) / N);

    // Поиск пика в диапазоне сердечного ритма
    const fMin = bpmRange.min / 60;
    const fMax = bpmRange.max / 60;

    console.log(
      'Searching for peaks in range:',
      fMin.toFixed(2),
      '-',
      fMax.toFixed(2),
      'Hz (',
      bpmRange.min,
      '-',
      bpmRange.max,
      'BPM)',
    );

    const candidates = [];

    // Найдем все локальные максимумы в интересующем диапазоне
    for (let i = 1; i < N / 2 - 1; i++) {
      const f = freqs[i];
      if (f >= fMin && f <= fMax) {
        // Проверяем, является ли точка локальным максимумом
        if (psd[i] > psd[i - 1] && psd[i] > psd[i + 1]) {
          const bpmCandidate = Math.round(f * 60);
          candidates.push({
            freq: f,
            bpm: bpmCandidate,
            power: psd[i],
            index: i,
          });
        }
      }
    }

    console.log('Candidates found:', candidates.length);
    candidates.forEach((c) =>
      console.log('  -', c.bpm, 'BPM, power:', c.power.toFixed(6)),
    );

    if (candidates.length > 0) {
      // Сортируем по мощности и выбираем лучший
      candidates.sort((a, b) => b.power - a.power);
      const best = candidates[0];

      // Проверяем отношение сигнал/шум
      const avgNoise =
        psd.slice(1, N / 2).reduce((a, b) => a + b) / (N / 2 - 1);
      const snr = best.power / (avgNoise || 1e-10);

      console.log('Best candidate:', best.bpm, 'BPM, SNR:', snr.toFixed(2));

      // Более мягкие критерии
      if (snr > 1.2) {
        // Снизили требования к SNR
        setBpm((prev) => {
          console.log('Setting BPM:', best.bpm, '(previous:', prev, ')');
          if (!prev) return best.bpm;
          // Сглаживание
          const alpha = snr > 3 ? 0.6 : 0.4;
          const smoothed = Math.round(alpha * best.bpm + (1 - alpha) * prev);
          console.log('Smoothed BPM:', smoothed);
          return smoothed;
        });
      } else {
        console.log('SNR too low:', snr, '< 1.2');

        // Если SNR низкий, попробуем упрощенный метод подсчета пиков
        const simplePeakCount = countPeaksSimple(signal, fps);
        if (simplePeakCount) {
          console.log('Using simple peak count:', simplePeakCount, 'BPM');
          setBpm(simplePeakCount);
        }
      }
    } else {
      console.log('Local maxima not found, trying global search...');

      // Глобальный поиск максимума
      let globalMaxIdx = -1;
      let globalMaxVal = -Infinity;

      for (let i = 1; i < N / 2 - 1; i++) {
        const f = freqs[i];
        if (f >= fMin && f <= fMax && psd[i] > globalMaxVal) {
          globalMaxVal = psd[i];
          globalMaxIdx = i;
        }
      }

      if (globalMaxIdx > 0) {
        const globalBpm = Math.round(freqs[globalMaxIdx] * 60);
        console.log(
          'Global maximum:',
          globalBpm,
          'BPM, power:',
          globalMaxVal.toFixed(6),
        );
        setBpm(globalBpm);
      } else {
        console.log('Failed to find a peak in the spectrum');

        // Последняя попытка - простой подсчет пиков
        const simplePeakCount = countPeaksSimple(signal, fps);
        if (simplePeakCount) {
          console.log('Final attempt - simple count:', simplePeakCount, 'BPM');
          setBpm(simplePeakCount);
        }
      }
    }
  }, [greenSignal, capacity, fps, bpmRange, measuring]); // Добавили measuring в зависимости

  // Простой метод подсчета пиков во временной области
  const countPeaksSimple = useCallback(
    (signal: number[], sampleRate: number) => {
      if (signal.length < sampleRate * 5) return null; // Минимум 5 секунд

      // Более качественная фильтрация сигнала для подсчета пиков
      const smoothSignal = signal.map((_, i) => {
        const start = Math.max(0, i - 2);
        const end = Math.min(signal.length, i + 3);
        const window = signal.slice(start, end);
        return window.reduce((a, b) => a + b) / window.length;
      });

      // Находим пики с более строгими критериями
      const threshold = 0.5; // Увеличили порог до 50%
      const maxVal = Math.max(...smoothSignal);
      const minVal = Math.min(...smoothSignal);
      const range = maxVal - minVal;

      if (range === 0) return null; // Нет вариации в сигнале

      const peakThreshold = minVal + range * threshold;

      const peaks = [];
      const minDistance = Math.round(sampleRate * 0.4); // Минимум 0.4 сек между пиками (макс 150 BPM)

      // Находим все потенциальные пики
      for (let i = 2; i < smoothSignal.length - 2; i++) {
        if (
          smoothSignal[i] > peakThreshold &&
          smoothSignal[i] > smoothSignal[i - 1] &&
          smoothSignal[i] > smoothSignal[i + 1] &&
          smoothSignal[i] > smoothSignal[i - 2] &&
          smoothSignal[i] > smoothSignal[i + 2]
        ) {
          peaks.push({ index: i, value: smoothSignal[i] });
        }
      }

      // Фильтруем пики по расстоянию
      const validPeaks = [];
      let lastPeakIdx = -1;

      // Сортируем по убыванию значения (берем самые высокие пики)
      peaks.sort((a, b) => b.value - a.value);

      for (const peak of peaks) {
        if (
          lastPeakIdx < 0 ||
          Math.abs(peak.index - lastPeakIdx) >= minDistance
        ) {
          validPeaks.push(peak);
          lastPeakIdx = peak.index;
          if (validPeaks.length >= 10) break; // Ограничиваем количество пиков
        }
      }

      // Сортируем обратно по времени
      validPeaks.sort((a, b) => a.index - b.index);

      const durationSec = signal.length / sampleRate;
      const bpmSimple = Math.round((validPeaks.length / durationSec) * 60);

      console.log(
        'Improved count: found',
        validPeaks.length,
        'quality peaks over',
        durationSec.toFixed(1),
        's =',
        bpmSimple,
        'BPM',
      );
      console.log(
        'Signal range:',
        minVal.toFixed(2),
        '-',
        maxVal.toFixed(2),
        'threshold:',
        peakThreshold.toFixed(2),
      );
      console.log(
        'Total potential peaks:',
        peaks.length,
        'valid:',
        validPeaks.length,
      );

      return bpmSimple >= bpmRange.min && bpmSimple <= bpmRange.max
        ? bpmSimple
        : null;
    },
    [bpmRange],
  );

  // Передача результата с защитой от повторных вызовов
  const lastReportedBpm = useRef<number | null>(null);

  useEffect(() => {
    if (bpm && onPulseDetected && bpm !== lastReportedBpm.current) {
      console.log('Passing BPM to parent component:', bpm);
      lastReportedBpm.current = bpm;
      onPulseDetected(bpm);
    }
  }, [bpm, onPulseDetected]);

  // Подготовка данных для графика
  const chartData = useMemo(() => {
    const signal = processedSignal.length > 0 ? processedSignal : greenSignal;
    if (!signal.length) {
      return {
        labels: [],
        datasets: [{ label: 'PPG', data: [] }],
      };
    }

    const n = Math.min(signal.length, 300); // Показываем только последние 10 секунд
    const recentSignal = signal.slice(-n);
    const labels = recentSignal.map((_, i) => `${((n - i) / fps).toFixed(1)}s`);

    // Нормализация для визуализации
    const mean = recentSignal.reduce((a, b) => a + b, 0) / n;
    const std =
      Math.sqrt(recentSignal.reduce((s, v) => s + (v - mean) ** 2, 0) / n) || 1;
    const normalized = recentSignal.map((v) => (v - mean) / std);

    return {
      labels,
      datasets: [
        {
          label: 'Pulse waveform',
          data: normalized,
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.1,
          borderColor:
            signalQuality === 'good'
              ? '#4caf50'
              : signalQuality === 'fair'
              ? '#ff9800'
              : '#f44336',
          backgroundColor:
            signalQuality === 'good'
              ? 'rgba(76, 175, 80, 0.1)'
              : signalQuality === 'fair'
              ? 'rgba(255, 152, 0, 0.1)'
              : 'rgba(244, 67, 54, 0.1)',
        },
      ],
    };
  }, [processedSignal, greenSignal, fps, signalQuality]);

  const chartOpts = useMemo(
    () => ({
      responsive: true,
      animation: false as const,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      },
      scales: {
        x: {
          display: false,
          grid: { display: false },
        },
        y: {
          display: true,
          grid: { color: 'rgba(0,0,0,0.1)' },
          ticks: {
            display: false,
          },
        },
      },
    }),
    [],
  );

  useEffect(() => {
    return () => stop();
  }, [stop]);

  const getQualityText = () => {
    switch (signalQuality) {
      case 'good':
        return 'Excellent signal quality';
      case 'fair':
        return 'Fair quality';
      case 'poor':
        return 'Poor quality — improve lighting';
      default:
        return '';
    }
  };

  const getQualityColor = () => {
    switch (signalQuality) {
      case 'good':
        return '#4caf50';
      case 'fair':
        return '#ff9800';
      case 'poor':
        return '#f44336';
      default:
        return '#666';
    }
  };

  return (
    <div className={styles.pulseDetector}>
      <div className={styles.header}>
        <h4 className={styles.title}>Face Pulse Measurement</h4>
        <p className={styles.description}>
          Look straight at the camera with good lighting. Do not move during the
          measurement.
        </p>
      </div>

      <div className={styles.controls}>
        <button
          onClick={measuring ? stop : start}
          className={`${styles.button} ${
            measuring ? styles.buttonStop : styles.buttonStart
          }`}
        >
          {measuring ? 'Stop measurement' : 'Start measurement'}
        </button>

        {currentValue && (
          <div className={styles.currentValue}>
            Current value: <strong>{currentValue} bpm</strong>
          </div>
        )}
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {measuring && (
        <div className={styles.status} style={{ color: getQualityColor() }}>
          {getQualityText()}
        </div>
      )}

      {bpm && (
        <div className={styles.result}>
          <div className={styles.pulseValue}>
            Your pulse: <span className={styles.bpmValue}>{bpm}</span> bpm
          </div>
        </div>
      )}

      {measuring && (
        <div className={styles.chartContainer}>
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className={styles.progressText}>
              Measurement: {Math.round(progress)}% (
              {Math.round((progress / 100) * windowSec)}s of {windowSec}s)
            </div>
            <div className={styles.debugInfo}>
              Signal: {greenSignal.length} points | BPM: {bpm || '—'} | Quality:{' '}
              {signalQuality}
            </div>
          </div>
          <div style={{ height: '200px', marginBottom: '20px' }}>
            <Line data={chartData} options={chartOpts} />
          </div>
        </div>
      )}

      {showPreview && isCameraActive && (
        <div className={styles.videoContainer}>
          <video
            ref={videoRef}
            playsInline
            muted
            className={styles.video}
            style={{
              maxWidth: '400px',
              maxHeight: '300px',
              border: '2px solid ' + getQualityColor(),
              borderRadius: '8px',
            }}
          />
          <div className={styles.videoOverlay}>
            <div className={styles.faceGuide}>
              Position your face in the center
            </div>
          </div>
        </div>
      )}

      {!showPreview && (
        <video ref={videoRef} playsInline muted style={{ display: 'none' }} />
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div className={styles.info}>
        <p className={styles.infoText}>
          <strong>Tips for accurate measurement:</strong>
        </p>
        <ul className={styles.infoList}>
          <li>Use good, even lighting (avoid shadows)</li>
          <li>
            Keep your face centered at a distance of 30–50 cm from the camera
          </li>
          <li>Do not move or speak during the measurement</li>
          <li>
            The measurement will take {windowSec} seconds for maximum accuracy
          </li>
          <li>Watch the signal quality indicator</li>
        </ul>
        <p className={styles.disclaimer}>
          <small>
            ⚠️ This is not a medical device. Results are approximate. If you
            have heart problems, consult a doctor.
          </small>
        </p>
      </div>
    </div>
  );
};
