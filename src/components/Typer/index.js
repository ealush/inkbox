import React, { useState, useEffect } from 'react';
import { uniqueId } from 'lodash';
import './style.scss';

const explanation = 'You can always go forward.     Never back.                    Everything is temporary.       Nothing lasts forever.'
const prompt = 'Start typing:                  ';

const convert = (oldMin, oldMax, newMin, newMax, oldValue) => (
    (((oldValue - oldMin) * (newMax - newMin)) / (oldMax - oldMin)) + newMin
);

const MAX_CHAR_COUNT = 155;
const LINE_COUNT = 5;
const MAX_PER_LINE = 31;
const CHAR_HEIGHT = 40;
const CHAR_WIDTH = 17;
const FADE_OUT_AFTER = 31;

function Typer() {
    const [stream, setStream] = useState({ chars: [] });
    const [fadeAfter, setFadeAfter] = useState(explanation.length);

    const useType = ({ key = '' } = {}) => {
        if (!key.length || key.length > 1) {
            return;
        }

        let next = stream;

        if (stream.length % MAX_CHAR_COUNT === 0) {
            next.chars = stream.chars.slice(0, stream.length - MAX_CHAR_COUNT);
        }
        next.chars = [...next.chars, { key, id: uniqueId() }];
        setStream(next)
    }

    const say = (phrase, cb) => {
        Array.prototype.forEach.call(phrase, (key, i) => {
            setTimeout(() => {
                useType({ key });

                if (i === phrase.length - 1) { cb(); }
            }, i * 50);
        });
    }

    const showPrompt = () => {
        setFadeAfter(FADE_OUT_AFTER);

        say(prompt, () => {
            document.body.addEventListener('keyup', useType);
        });
    }

    const clearAll = () => {
        for (let i = fadeAfter; i >= -1; i--) {
            setTimeout(() => {

                if (i === -1) {
                    stream.chars = [];
                    setStream(stream);
                    showPrompt();
                } else {
                    setFadeAfter(i);
                }
            }, 50 * (fadeAfter - i));
        }
    }

    useEffect(() => {
        setTimeout(() => {
            say(explanation, clearAll);
        }, 1500);
    }, []);

    return (
        <main>
            <div className="content">
                {stream.chars.map(({key, id}, i) => {
                    let className;
                    if (stream.chars.length - i > MAX_CHAR_COUNT) {
                        return null;
                    }

                    const lineNumber = Math.floor(convert(0, MAX_CHAR_COUNT, 0, LINE_COUNT, i));

                    let style = {
                        transform: `translateX(${(i % MAX_PER_LINE) * CHAR_WIDTH}px) translateY(${lineNumber * CHAR_HEIGHT}px)`
                    };

                    if (stream.chars.length - i > fadeAfter) {
                        className = 'hidden'
                    }

                    return <span className={className} key={id} style={style}>{key}</span>;
                })}
            </div>
        </main>
    );
}

export default Typer;