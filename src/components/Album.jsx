import { useEffect, useState } from "react";
import Piece from './Piece';
import './album.css';

const EditableValue = (props) => {
    const [value, setValue] = useState(props.value);

    const handleChange = (event) => {
        setValue(event.target.value);
    }

    return (
        <input autoFocus onChange={(e) => handleChange(e)} value={value} className='artist-card-value editable-value'>

        </input>
    )
};

const NoneEditableValue = (props) => (
    <div className='artist-card-value none-editable-value'>
        {props.value}
    </div>
);

const AlbumDetail = (props) => {
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

const Album = (props) => {
    let [isOpen, setIsOpen] = useState(false)

    const open = () => {
        setIsOpen(true)
    }

    return (
        <div className={isOpen ? "album open" : "album"} onClick={() => open()}>
            {isOpen ? "" :
                <div className="album-card">
                    <div className='album-card-value none-editable-value'>
                        {props.album.name}
                    </div>
                </div>
            }
            {isOpen ?
                <div className="album-card">
                    {Object.getOwnPropertyNames(props.album).map(property => {
                        if (props.hiddenProperties.includes(property)) return "";
                        return <AlbumDetail
                            key={property}
                            title={property}
                            value={props.album[property]}
                        />
                    })}
                </div> : ""}
            {isOpen ?
                <div>
                    {props.pieces?.map(piece =>
                        <Piece piece={piece} />
                    )}
                    <button>
                        Add Piece
                    </button>
                </div>
                : ""}
        </div>
    )
}

export { Album };
export default Album;
