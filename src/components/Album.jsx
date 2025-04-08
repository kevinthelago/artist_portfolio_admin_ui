import { useEffect, useState } from "react";
import Piece from './Piece';
import './album.css';

const Album = (props) => {
    let [isOpen, setIsOpen] = useState(false)

    const open = () => {
        setIsOpen(!isOpen)
    }

    return(
        <div className={isOpen ? "album open" : "album"} onClick={() => open()}>
            <div className="album-name">
                {props.name}
            </div>
            <div className="album-index">
                {props.i}
            </div>
            {props.pieces ? isOpen ? props.pieces.map(piece => 
                <Piece piece={piece} />
            ) : "" : ""}
        </div>
    )
}

export { Album };
export default Album;
