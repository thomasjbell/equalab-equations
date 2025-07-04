import React from 'react';

interface LittleLogoProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Optional className for Tailwind CSS or other styling.
   */
  className?: string;
}

const LittleLogo: React.FC<LittleLogoProps> = ({ className, ...rest }) => {
  return (
    <svg 
      className={className} 
      {...rest} 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 1024 1024"
    >
      <defs>
        <style>
          {`
            .cls-1 {
              fill: #082f49;
            }
            .cls-2 {
              fill: #ecfeff;
            }
          `}
        </style>
      </defs>
      <g id="Layer_1" data-name="Layer 1">
        <rect className="cls-2" width="1024" height="1024" rx="160" ry="160"/>
      </g>
      <g id="Layer_2" data-name="Layer 2">
        <rect className="cls-1" x="192" y="229.47" width="640" height="180" rx="32" ry="32"/>
        <rect className="cls-1" x="192" y="614.53" width="640" height="180" rx="32" ry="32"/>
      </g>
    </svg>
  );
};

export default LittleLogo;