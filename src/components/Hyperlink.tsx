import * as React from 'react';
import {useState} from 'react';
import Chip from '@mui/material/Chip';
import Autocomplete, {AutocompleteRenderInputParams} from '@mui/material/Autocomplete';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import {Tooltip} from "@mui/material";
import TextField from "@mui/material/TextField";

export interface HyperlinkProps {
  value: string[]
  label?: string
  disabled?: boolean
  readOnly?: boolean
  placeholder: string
  defaultValue: string[]
}

export var hyperlinkData: HyperlinkProps = {
  value: ["https://stackoverflow.com/questions/59057057/material-ui-how-to-specify-maxwidth-of-chip"],
  label: "Blep Blap",
  readOnly: false,
  disabled: false,
  placeholder: "Provide URL",
  defaultValue: ["google.com"]
}

export default function Hyperlink(data: HyperlinkProps) {

  const [url, setUrl] = useState(data.value)

  function handleUrlChange(event: React.SyntheticEvent<Element, Event>, newValue: string[]) {
    (newValue.length === 0) ? setUrl([]) : setUrl([newValue[newValue.length - 1]])
  }

  function getChip() {
    return () => (
        <Tooltip title={url[0]}>
          <Chip variant="outlined"
                icon={<LinkRoundedIcon/>}
                label={url[0]}
                onDelete={openUrl(url[0])}
                deleteIcon={<OpenInNewRoundedIcon/>}
                sx={{maxWidth: 210}} // TODO - make it relative to field width
              // onClick={openUrl()} // should we click on entire chip or only OpenInNew icon?
          />
        </Tooltip>
    )
  }

  function getInputField() {
    return (params: AutocompleteRenderInputParams) => (
        <TextField
            {...params}
            variant="filled"
            label={data.label}
            placeholder={url.length > 0 ? "" : data.placeholder}
        />
    );
  }

  return (
      <Autocomplete
          value={url}
          disabled={data.disabled}
          readOnly={data.readOnly}
          defaultValue={data.defaultValue}
          onChange={handleUrlChange}
          renderTags={getChip()}
          renderInput={getInputField()}
          multiple={true} // allows chip
          freeSolo
          options={[]}
      />
  );
}

function openUrl(url: string) {
  return () => window.open(processUrlString(url), "_blank", "noopener,noreferrer");
}

enum SUPPORTED_PROTOCOL {
  FILE = "file",
  FTP = "ftp",
  GOPHER = "gopher",
  HTTP = "http",
  HTTPS = "https",
  MAILTO = "mailto",
  NEWS = "news",
  SFTP = "sftp",
  SKYPE = "skype",
  TELNET = "telnet",
}

function processUrlString(url: string): string {
  const trimmedString = url.trim();
  if (trimmedString.length === 0) {
    return "";
  }

  const indexOfColon = trimmedString.indexOf(":");
  const protocol = indexOfColon >= 0 ? trimmedString.substring(0, indexOfColon) : undefined;
  if (protocol !== undefined && Object.values(SUPPORTED_PROTOCOL).includes(protocol.toLowerCase() as SUPPORTED_PROTOCOL)) {
    return trimmedString;
  }

  //Do not open unsupported links with unsupported protocols
  if (protocol !== undefined) {
    //ftp url might look like ftp.example.com:$port but would not be recognized by the above check
    if (trimmedString.length > 4 && trimmedString.substring(0, 4).toLowerCase() === "ftp.") {
      return "ftp://" + trimmedString;
    }
    return "https://" + trimmedString;
  }

  if (trimmedString.includes("@")) {
    return "mailto:" + trimmedString;
  }

  if (trimmedString.length > 4 && trimmedString.substring(0, 4).toLowerCase() === "ftp.") {
    return "ftp://" + trimmedString;
  }

  return "https://" + trimmedString;
}

