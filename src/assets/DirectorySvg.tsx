const DirectorySvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" {...props}>
      <path
        d="M10 30 C10 25, 15 20, 20 20 H40 C45 20, 50 25, 55 30 H80 C85 30, 90 35, 90 40 V80 C90 85, 85 90, 80 90 H20 C15 90, 10 85, 10 80 Z"
        fill="#f1c40f"
      />
    </svg>
  );
};

export default DirectorySvg;
