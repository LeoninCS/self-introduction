import React from 'react';
import styled from 'styled-components';

const Card = () => {
  return (
    <StyledWrapper>
      <div className="card">
        <div className="card-info">
          <p className="title">Magic Card</p>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .card {
    --background: linear-gradient(to right, #74ebd5 0%, #acb6e5 100%);
    width: 190px;
    height: 254px;
    padding: 5px;
    border-radius: 1rem;
    overflow: visible;
    background: #74ebd5;
    background: var(--background);
    position: relative;
    z-index: 1;
  }

  .card::before,
  .card::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 1rem;
    z-index: -1;
  }

  .card::before {
    background: linear-gradient(to bottom right, #f6d365 0%, #fda085 100%);
    transform: rotate(2deg);
  }

  .card::after {
    background: linear-gradient(to top right, #84fab0 0%, #8fd3f4 100%);
    transform: rotate(-2deg);
  }

  .card-info {
    --color: #292b2c;
    background: var(--color);
    color: var(--color);
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    overflow: visible;
    border-radius: 0.7rem;
    position: relative;
    z-index: 2;
  }

  .card .title {
    font-weight: bold;
    letter-spacing: 0.1em;
  }

  .card:hover::before,
  .card:hover::after {
    opacity: 0;
  }

  .card:hover .card-info {
    color: #74ebd5;
    transition: color 1s;
  }`;

export default Card;
