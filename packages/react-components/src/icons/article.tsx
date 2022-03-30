const article = (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>Article</title>
    <mask id="a" fill="#fff">
      <rect y={0.75} width={5.6} height={5.6} rx={1} />
    </mask>
    <rect
      y={0.75}
      width={5.6}
      height={5.6}
      rx={1}
      stroke="currentColor"
      fill="transparent"
      strokeWidth={2.6}
      mask="url(#a)"
    />
    <rect
      x={7.6}
      y={0.75}
      width={8.4}
      height={1.3}
      rx={0.65}
      fill="currentColor"
    />
    <rect
      x={7.6}
      y={5.05}
      width={8.4}
      height={1.3}
      rx={0.65}
      fill="currentColor"
    />
    <rect y={9.35} width={16} height={1.3} rx={0.65} fill="currentColor" />
    <rect y={13.65} width={16} height={1.3} rx={0.65} fill="currentColor" />
    <rect y={17.95} width={16} height={1.3} rx={0.65} fill="currentColor" />
  </svg>
);

export default article;
