export default {
  board:{
    lineHeight: "0px",
    marginTop: "10px",
    width: "61vw",
    height: "53vw",
    background: "#8bd5df"
  },
  Tile:{
    display: "inline-flex",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "black",
  },
  Pointer:{
    cursor: "pointer"
  },
  Invert: {
    transform: "scale(-1, -1)"
  },
  turnArrow: {
    marginTop: "75px"
  },
  gridLi: {
    listStyleType: "none",
    position: "relative",
    float: "left",
    width: "11.85714285714286%",
    padding: "0 0 13.16760145166612% 0",
    transform: "rotate(-60deg) skewY(30deg)",
    borderWidth: "2px",
    borderStyle: "solid",
    overflow: "hidden",
    visibility: "hidden"
  },
  hexagon: {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    background: "White",
    transform: "skewY(-30deg) rotate(60deg)",
    textAlign: "center",
    paddingTop: "30px",
    paddingBottom: "30px"
  },
  hexToTheRight: {
    transform: "translateX(50%) rotate(-60deg) skewY(30deg)"
  },
  notTopHexRow: {
    marginTop: "-2.1vw"
  },
  visibleHex: {
    visibility: "visible"
  }
}
