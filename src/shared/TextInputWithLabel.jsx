import styled from 'styled-components';

const StyledLabel = styled.label`
  font-size: 20px;
  margin: 0px;
`;
const StyledInput = styled.input``;

function TextInputWithLabel({ elementId, labelText, onChange, ref, value }) {
  return (
    <>
      <StyledLabel htmlFor={elementId}> {labelText} </StyledLabel>
      <StyledInput
        type="text"
        id={elementId}
        ref={ref}
        value={value}
        onChange={onChange}
      ></StyledInput>
    </>
  );
}

export default TextInputWithLabel;
