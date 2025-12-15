<script>
  /**
   * CircularProgress Component
   * Renders an SVG circular progress ring with smooth CSS transitions
   * Props:
   * - progress: Number between 0-1 representing completion (1 = full)
   * - color: CSS color string for the progress stroke
   * - size: Size in pixels (default: 280)
   */
  
  let { progress = 1, color = '#ef4444', size = 280 } = $props();
  
  // SVG configuration
  const viewBoxSize = 200;
  const strokeWidth = 8;
  const radius = 90; // (viewBoxSize / 2) - (strokeWidth / 2) - padding
  const circumference = 2 * Math.PI * radius; // ~565.49
  
  // Calculate stroke-dashoffset based on progress
  // Progress of 1 means full circle (offset = 0)
  // Progress of 0 means empty circle (offset = circumference)
  let strokeDashoffset = $derived(circumference * (1 - progress));
</script>

<svg
  class="progress-ring"
  width={size}
  height={size}
  viewBox="0 0 {viewBoxSize} {viewBoxSize}"
  aria-hidden="true"
>
  <!-- Background Track -->
  <circle
    class="progress-ring-track"
    cx={viewBoxSize / 2}
    cy={viewBoxSize / 2}
    r={radius}
    stroke={color}
    stroke-opacity="0.1"
    stroke-width={strokeWidth}
  />
  
  <!-- Progress Arc -->
  <circle
    class="progress-ring-progress stroke-transition"
    cx={viewBoxSize / 2}
    cy={viewBoxSize / 2}
    r={radius}
    stroke={color}
    stroke-width={strokeWidth}
    stroke-dasharray={circumference}
    stroke-dashoffset={strokeDashoffset}
  />
</svg>

<style>
  svg {
    /* Rotate so progress starts from 12 o'clock position */
    transform: rotate(-90deg);
    transform-origin: center;
  }
  
  .progress-ring-track,
  .progress-ring-progress {
    fill: none;
    stroke-linecap: round;
  }
  
  .progress-ring-progress {
    /* Smooth transition for progress changes - matches 1 second timer tick */
    transition: stroke-dashoffset 1s linear;
  }
</style>
