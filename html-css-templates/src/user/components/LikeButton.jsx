import React from 'react';
import styled from 'styled-components';

const Tooltip = () => {
  return (
    <StyledWrapper>
      <div className="tooltip">
        <button type="button" aria-label="trigger" className="sizer trigger">
          <svg xmlns="http://www.w3.org/2000/svg" className="sizer heart" viewBox="0 0 256 256" strokeWidth={0} fill="currentColor" stroke="currentColor">
            <path opacity="0.2" className="fill" d="M232,102c0,66-104,122-104,122S24,168,24,102A54,54,0,0,1,78,48c22.59,0,41.94,12.31,50,32,8.06-19.69,27.41-32,50-32A54,54,0,0,1,232,102Z" />
            <path d="M178,40c-20.65,0-38.73,8.88-50,23.89C116.73,48.88,98.65,40,78,40a62.07,62.07,0,0,0-62,62c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,228.66,240,172,240,102A62.07,62.07,0,0,0,178,40ZM128,214.8C109.74,204.16,32,155.69,32,102A46.06,46.06,0,0,1,78,56c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,155.61,146.24,204.15,128,214.8Z" />
          </svg>
          <svg className="sizer checkround" viewBox="0 0 44 44">
            <path transform="translate(-2.000000, -2.000000)" d="M 39.7428882,11.5937758 C35.2809627,6.53125861 30.0333333,4 24,4 C12.95,4 4,12.95 4,24 C4,35.05 12.95,44 24,44 C35.05,44 44,35.05 44,24 C44,19.3 42.5809627,15.1645919 39.7428882,11.5937758" />
          </svg>
        </button>
        <div className="content">
          Like <span data-decrease={335} data-increase={336} />
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .tooltip {
    --bg: #fff;
    --cl: red;
    --sz: 1rem;
    --sizer: 44px;
    --h-cnt: calc(var(--sz) * 2);
    position: relative;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .trigger {
    color: var(--cl);
    background: var(--bg);
    font-weight: 600;
    cursor: pointer;
    border-radius: 999px;
    padding: calc(var(--sz) / 2);
    font-size: var(--sz);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    border: 1px solid transparent;
    outline: none;
    box-shadow:
      rgba(95, 95, 115, 0.25) 0px 2px 5px -1px,
      rgba(255, 255, 255, 0.3) 0px 1px 3px -1px;
  }
  .trigger .heart {
    --sizer: 30px;
    transition: all 0.2s ease;
    color: var(--cl);
    margin-bottom: -2px;
  }
  .trigger .heart .fill {
    opacity: 0;
    display: none;
  }

  .trigger:hover {
    --scale-1: 0.9;
    --scale-2: 0.8;
    animation: scaling 1s ease infinite;
  }
  .trigger:hover .heart {
    --scale-1: 1.3;
    --scale-2: 1.4;
    animation: scaling 1s ease infinite;
  }
  @keyframes scaling {
    0% {
      transform: scale(1);
    }
    20%,
    90% {
      transform: scale(var(--scale-1));
    }
    50% {
      transform: scale(var(--scale-2));
    }
  }

  .trigger .checkround {
    position: absolute;
    fill: none;
    stroke: var(--cl);
    scale: 1.1;
    stroke-width: 3;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dashoffset: 162.6;
    stroke-dasharray: 0 330 158 134.6;
    rotate: 130deg;
    opacity: 0.6;
    z-index: -1;
    cursor: none;
    pointer-events: none;
  }

  .content {
    position: absolute;
    border-radius: 999px;
    top: calc(var(--h-cnt) * -0.75);
    font-size: 14px;
    padding: calc(var(--sz) / 4) calc(var(--sz) / 2);
    z-index: -1;
    pointer-events: none;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: max-content;
    transition: all 0.3s ease;
    opacity: 0;
    transform: scale(0) translate(0, 200%);
    font-weight: 600;
    background-color: var(--cl);
    color: whitesmoke;
  }

  .content::before {
    position: absolute;
    content: "";
    height: 1rem;
    width: 1rem;
    bottom: -0.2em;
    left: 50%;
    transform: translate(-50%) rotate(45deg);
    border-radius: 2px;
    z-index: -2;
    background-color: transparent;
  }

  .tooltip .trigger:hover + .content {
    top: calc(var(--h-cnt) * -1.25);
    visibility: visible;
    pointer-events: auto;
    opacity: 1;
    transform: scale(1) translate(0%, 0%);
  }

  .content span {
    --y-crease: 16px;
    position: relative;
    margin-left: 4px;
    height: var(--y-crease);
    overflow: hidden;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-direction: column;
    margin-bottom: -1px;
  }
  .content span::before,
  .content span::after {
    line-height: 1.1;
    position: relative;
    transform: translateY(calc(var(--y-crease) / 2));
    transition: transform 0.5s ease;
    transition-delay: 0s;
  }
  .content span::before {
    content: attr(data-decrease);
  }
  .content span::after {
    content: attr(data-increase);
  }

  /* Like Indicator */
  .trigger:focus .heart .fill {
    display: unset;
    animation: filled 0.2s ease 1s forwards;
  }
  @keyframes filled {
    to {
      opacity: 0.3;
    }
  }
  .trigger:focus + .content span::before,
  .trigger:focus + .content span::after {
    transform: translateY(calc((var(--y-crease) / 2) * -1));
    transition-delay: 1s;
  }
  .trigger:focus .checkround {
    animation:
      stroke 0.9s linear forwards,
      checkhide 0.45s linear 0.9s forwards;
  }
  @keyframes stroke {
    to {
      stroke-dasharray: 0 163 158 134.6;
    }
  }
  @keyframes checkhide {
    to {
      stroke: var(--bg);
      scale: 0;
      stroke-width: 0;
      opacity: 0;
    }
  }

  .sizer {
    width: var(--sizer);
    min-width: var(--sizer);
    max-width: var(--sizer);
    height: var(--sizer);
    min-height: var(--sizer);
    max-height: var(--sizer);
  }`;

export default Tooltip;
