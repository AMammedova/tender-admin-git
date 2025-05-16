import React from "react";

const Logo = ({ width, height }: { width: number; height: number }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.12793 26.2655C0.12793 11.8771 11.7921 0.212891 26.1806 0.212891H73.0753C87.4638 0.212891 99.1279 11.8771 99.1279 26.2655V73.1603C99.1279 87.5487 87.4638 99.2129 73.0753 99.2129H26.1806C11.7921 99.2129 0.12793 87.5487 0.12793 73.1603V26.2655Z"
        fill="#465FFF"
      />
      <g filter="url(#filter0_d_5147_2032)">
        <path
          d="M26.1812 26.2666C26.1812 23.3889 28.514 21.0561 31.3917 21.0561C34.2694 21.0561 36.6022 23.3889 36.6022 26.2666V73.1614C36.6022 76.0391 34.2694 78.3719 31.3917 78.3719C28.514 78.3719 26.1812 76.0391 26.1812 73.1614V26.2666Z"
          fill="white"
        />
      </g>
      <g opacity="0.9" filter="url(#filter1_d_5147_2032)">
        <path
          d="M45.7202 47.1074C45.7202 44.2297 48.053 41.8969 50.9307 41.8969C53.8084 41.8969 56.1413 44.2297 56.1413 47.1074V73.16C56.1413 76.0377 53.8084 78.3706 50.9307 78.3706C48.053 78.3706 45.7202 76.0377 45.7202 73.16V47.1074Z"
          fill="white"
        />
      </g>
      <g opacity="0.7" filter="url(#filter2_d_5147_2032)">
        <path
          d="M65.2573 34.0802C65.2573 31.2025 67.5902 28.8696 70.4678 28.8696C73.3455 28.8696 75.6784 31.2025 75.6784 34.0802V73.1591C75.6784 76.0368 73.3455 78.3696 70.4678 78.3696C67.5902 78.3696 65.2573 76.0368 65.2573 73.1591V34.0802Z"
          fill="white"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_5147_2032"
          x="25.0024"
          y="20.4667"
          width="12.7783"
          height="59.6732"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="0.589356" />
          <feGaussianBlur stdDeviation="0.589356" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_5147_2032"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_5147_2032"
            result="shape"
          />
        </filter>
        <filter
          id="filter1_d_5147_2032"
          x="44.5415"
          y="41.3075"
          width="12.7783"
          height="38.8311"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="0.589356" />
          <feGaussianBlur stdDeviation="0.589356" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_5147_2032"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_5147_2032"
            result="shape"
          />
        </filter>
        <filter
          id="filter2_d_5147_2032"
          x="64.0786"
          y="28.2803"
          width="12.7783"
          height="51.8574"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="0.589356" />
          <feGaussianBlur stdDeviation="0.589356" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_5147_2032"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_5147_2032"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default Logo;
