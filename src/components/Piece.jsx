import { useState } from 'react';
import './piece.css';

const EditablePiece = (props) => (
    <div className="piece">
        <input className="piece-name">
            {props.name}
        </input>
        <input className="piece-material">
            {props.material}
        </input>
        <input className="piece-dimensions">
            {props.dimensions}
        </input>
        <input className="piece-year-completed">
            {props.yearCompleted}
        </input>
        <input className="piece-description">
            {props.description}
        </input>
        <input className="piece-is-album-cover">
            {props.isAlbumCover}
        </input>
        <input className="piece-index">
            {props.i}
        </input>
    </div>
)

const VisualPiece = (props) => (
    <div className="piece">
        <div className="piece-name">
            {props.name}
        </div>
        <div className="piece-material">
            {props.material}
        </div>
        <div className="piece-dimensions">
            {props.dimensions}
        </div>
        <div className="piece-year-completed">
            {props.yearCompleted}
        </div>
        <div className="piece-description">
            {props.description}
        </div>
        <div className="piece-is-album-cover">
            {props.isAlbumCover}
        </div>
        <div className="piece-index">
            {props.i}
        </div>
    </div>
)

const Piece = (props) => {
    let [isEditing, setIsEditing] = useState(false);

    const edit = () => {
        setIsEditing(!isEditing)
    }

    return (
        <div className="piece" onClick={() => edit()}>
            {isEditing ?
                <EditablePiece props={props} /> :
                <VisualPiece props={props} />
            }
        </div>
    )
}

export { Piece }
export default Piece
