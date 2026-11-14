export default function IconeCoracao({ cheio, className = "" }: { cheio: boolean; className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill={cheio ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    >
      <path d="M12 20.5C5 15.5 3 12 3 8.9 3 6.2 5 4.5 7.3 4.5c1.8 0 3.5 1 4.7 2.800C13.200 5.500 14.900 4.500 16.700 4.500 19 4.500 21 6.200 21 8.900c0 3.100-2 6.600-9 11.600Z" />
    </svg>
  );
}
