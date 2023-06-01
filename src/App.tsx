import React from 'react';
import {Box} from "@mui/material";
import Hyperlink, {hyperlinkData} from "./components/Hyperlink";

function App() {
    return (
        <div className="App">
            <Box sx={{width: 300, paddingTop: 5, paddingLeft: 5,}}>
                1:
                {Hyperlink(hyperlinkData)}
                2:
                {Hyperlink(hyperlinkData)}
                {/*{Tags()}*/}
            </Box>
        </div>
    )
}

export default App;
