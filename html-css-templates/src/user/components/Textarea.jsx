import React from "react";
import styled from "styled-components";

const Textarea = ({ label, name, value, onChange }) => {
  return (
    <StyledWrapper>
      <div className="textarea-group">
        <textarea
          required
          name={name}
          rows="5"
          className="textarea"
          value={value}
          onChange={onChange}
        />
        <label className="user-label">{label}</label>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .textarea-group {
    position: relative;
    margin-bottom: 1.5rem;
  }

  .textarea {
    border: 1.5px solid #9e9e9e;
    border-radius: 1rem;
    background: none;
    padding: 1.2rem 1rem 1rem;
    font-size: 1rem;
    color: #212121;
    width: 100%;
    resize: none;
    transition: border 150ms ease-in-out;
  }

  .user-label {
    position: absolute;
    left: 16px;
    top: 1rem;
    background-color: #ffffff;
    padding: 0 0.4em;
    color: #757575;
    pointer-events: none;
    transition: 150ms ease-in-out;
    font-size: 1rem;
  }

  .textarea:focus,
  .textarea:valid {
    outline: none;
    border: 1.5px solid #1a73e8;
  }

  .textarea:focus ~ .user-label,
  .textarea:valid ~ .user-label {
    top: -0.6rem;
    font-size: 0.8rem;
    color: #1a73e8;
  }
`;

export default Textarea;
