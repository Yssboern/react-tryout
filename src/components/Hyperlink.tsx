import * as React from 'react';
import {useState} from 'react';
import Chip from '@mui/material/Chip';
import Autocomplete, {AutocompleteRenderGetTagProps, AutocompleteRenderInputParams} from '@mui/material/Autocomplete';
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
    value: ["https://stackoverflow.com/questions/59057057/material-ui-how-to-specify-maxwidth-of-chip"],
    label: "Blep Blap",
    readOnly: false,
    disabled: false,
    placeholder: "Provide URL",
    defaultValue: ["google.com"]
}

export default function Hyperlink(data: HyperlinkProps) {

    const [value, setValue] = useState(data.value)

    function openUrl() {
        return () => window.open(processUrlString(value[0]), "_blank", "noopener,noreferrer");
    }

    const LinkChip = (url: string, index: number, getTagProps: AutocompleteGetTagProps) => {

        // console.log("LinkChip: " + getTagProps.toString())
        return (
            <Tooltip title={value}>
                <Chip variant="outlined"
                      icon={<LinkRoundedIcon/>}
                      label={url}
                      onDelete={openUrl()}
                      deleteIcon={<OpenInNewRoundedIcon/>}
                      sx={{maxWidth: 210}} // TODO - make it relative to field width
                    // onClick={openUrl()} // should we click on entire chip or only OpenInNew icon?
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

    function allowInput() {
        return value.length > 0 ? "" : data.placeholder;
    }

    function getInputField() {
        return (params: AutocompleteRenderInputParams) => (
            <TextField
                {...params}
                variant="filled"
                label={data.label}
                placeholder={allowInput()} //use callback?
            />
        );
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
            renderInput={getInputField()}
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
