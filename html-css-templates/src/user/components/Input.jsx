import React from 'react';
import styled from 'styled-components';

const Input = ({ label, name, type, value, onChange }) => {
  return (
    <StyledWrapper>
      <div className="input-group">
        <input
          required
          type={type}
          name={name}
          autoComplete="off"
          className="input"
          value={value}
          onChange={onChange}
        />
        <label className="user-label">{label}</label>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .input-group {
    position: relative;
    margin-bottom: 1.5rem;
  }

  .input {
    border: solid 1.5px #9e9e9e;
    border-radius: 1rem;
    background: none;
    padding: 1rem;
    font-size: 1rem;
    color: #212121;
    width: 100%;
    transition: border 150ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .user-label {
    position: absolute;
    left: 15px;
    color: #757575;
    pointer-events: none;
    transform: translateY(1rem);
    transition: 150ms cubic-bezier(0.4, 0, 0.2, 1);
    background: #fff;
    padding: 0 0.2em;
  }

  .input:focus,
  .input:valid {
    outline: none;
    border: 1.5px solid #1a73e8;
  }

  .input:focus ~ .user-label,
  .input:valid ~ .user-label {
    transform: translateY(-50%) scale(0.85);
    color: #1a73e8;
  }
`;

export default Input;
