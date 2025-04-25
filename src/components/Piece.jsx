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

const EditableValue = (props) => {
    const [value, setValue] = useState(props.value);

    const handleChange = (event) => {
        setValue(event.target.value);
    }

    return (
        <input autoFocus onChange={(e) => handleChange(e)} value={value} className='piece-card-value editable-value'>

        </input>
    )
};

const NoneEditableValue = (props) => (
    <div className='piece-card-value none-editable-value'>
        {props.value}
    </div>
);


const PieceDetail = (props) => {
    const [isEditing, setIsEditing] = useState(false);

    const handleClick = () => {
        setIsEditing(true);
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            setIsEditing(false);
        }
    }

    return (
        <div
            onKeyDown={(e) => { handleKeyDown(e) }}
            onClick={() => { handleClick() }}
            id={"album-card-" + props.title.toLowerCase()}
        >
            <div className='album-card-key'>
                {props.title}
            </div>
            {isEditing ?
                <EditableValue value={props.value} /> :
                <NoneEditableValue value={props.value} />
            }
        </div>
    )
}

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
