import React, { useState, useEffect } from 'react';
import { uniqueId } from 'lodash';
import './style.scss';

const convert = (oldMin, oldMax, newMin, newMax, oldValue) => (
    (((oldValue - oldMin) * (newMax - newMin)) / (oldMax - oldMin)) + newMin
);

const MAX_CHAR_COUNT = 155;
const LINE_COUNT = 5;
const MAX_PER_LINE = 31;
const CHAR_HEIGHT = 30;
const CHAR_WIDTH = 17;
const FADE_OUT_AFTER = 60;

function Typer() {
    const [stream, setStream] = useState([]);

    const handleType = ({ key = '' } = {}) => {
        if (!key.length || key.length > 1) {
            return;
        }

        if (stream.length % MAX_CHAR_COUNT === 0) {
            stream.splice(0, stream.length - MAX_CHAR_COUNT);
        }

        stream.push({key, id: uniqueId() });


        setStream(stream);
    }

    useEffect(() => {
        document.body.addEventListener('keyup', handleType);
    }, [false]);

    return (
        <main>
            <div className="content">
                {stream.map(({key, id}, i) => {
                    let className;
                    if (stream.length - i > MAX_CHAR_COUNT) {
                        return null;
                    }

                    const lineNumber = Math.floor(convert(0, MAX_CHAR_COUNT, 0, LINE_COUNT, i));

                    let style = {
                        transform: `translateX(${(i % MAX_PER_LINE) * CHAR_WIDTH}px) translateY(${lineNumber * CHAR_HEIGHT}px)`
                    };

                    if (stream.length - i > FADE_OUT_AFTER) {
                        className = 'hidden'
                    }

                    return <span className={className} key={id} style={style}>{key}</span>;
                })}
            </div>
        </main>
    );
}

export default Typer;