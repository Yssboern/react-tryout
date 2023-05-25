import * as React from 'react';
import {useState} from 'react';
import Chip from '@mui/material/Chip';
import Autocomplete, {AutocompleteRenderGetTagProps} from '@mui/material/Autocomplete';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import {AutocompleteGetTagProps, Box, Tooltip} from "@mui/material";
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
    value: ["https://google.com"],
    label: "Blep Blap",
    readOnly: false,
    disabled: false,
    placeholder: "Provide URL",
    defaultValue: ["google.com"]
}

export default function Hyperlink(data: HyperlinkProps) {

    const [value, setValue] = useState(data.value)

    const LinkChip = (url: string, index: number, getTagProps: AutocompleteGetTagProps) => {

        // console.log("LinkChip: " + getTagProps.toString())
        return (
            <Tooltip title={"blep blap mlip"}>
                <Chip variant="outlined"
                      icon={<LinkRoundedIcon/>}
                      label={url}
                      onClick={() => window.open(processUrlString(url), "_blank", "noopener,noreferrer")}
                    // onDelete={() => setValue([])} // we dont want (X) button in chip?
                      onDelete={() => {
                      }}
                      deleteIcon={<OpenInNewRoundedIcon/>}
                />
            </Tooltip>
        )
    }

    function getChips() {
        return (value: readonly string[], getTagProps: AutocompleteRenderGetTagProps) => {

            console.log("getChips 1:" + value[0])
            return value.map((option: string, index: number) => (
                <Box key={index + "-box"}>
                    {LinkChip(option, index, getTagProps)}
                </Box>
            ))
        };
    }

    const handleChange = (event: React.SyntheticEvent<Element, Event>, value: string[]) => {

        console.log("handleChange 1:" + value)
        if (value.length === 0) {
            setValue([])
        } else {
            setValue([value[value.length - 1]])
        }
    }

    return (
        <Autocomplete
            value={value}
            disabled={data.disabled}
            readOnly={data.readOnly}
            onChange={handleChange}
            multiple={true}
            options={[]}
            defaultValue={["google.com"]}
            freeSolo
            renderTags={getChips()}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="filled"
                    label={data.label}
                    placeholder={data.value.length > 1 ? "" : "Provide URL"}
                />
            )}
        />
    );
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

function getTagProps() {
    throw new Error('Function not implemented.');
}
