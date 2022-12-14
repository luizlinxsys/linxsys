import React from "react";
import TextField from "@material-ui/core/TextField";
import Chip from "@material-ui/core/Chip";

export default function InputWithIcon(props) {
  // click chip and add text to input field



  return (
    <div>
      <TextField
        multiline
        rows={1}
        fullWidth
        id="input-with-icon-textfield"
        label="Variavel"
        variant="outlined"
        margin="dense"
        InputProps={{
          readOnly: true,
          startAdornment: (
            <div>
              <Chip
                label="Nome"
                size="small"
                style={{
                  cursor: "pointer",
                  margin: "4px",
                }}
                onClick={() => {
                  console.log(props.inputRef);
                }}
              />
            </div>
          ),
        }}
      />
    </div>
  );
}
