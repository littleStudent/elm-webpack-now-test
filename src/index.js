// pull in desired CSS/SASS files
require( './static/styles/main.scss' );
import Elm from "./elm/Main.elm";
// inject bundled Elm app into div#main
// var Elm = require( './elm/Main' );
Elm.Main.embed( document.getElementById( 'main' ) );
