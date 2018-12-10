import React, { useState, useEffect } from 'react';
import { uniqueId, padEnd } from 'lodash';
import './style.scss';

const MAX_CHAR_COUNT = 155;
const MAX_STATE_SIZE = MAX_CHAR_COUNT * 2;
const LINE_COUNT = 5;
const MAX_PER_LINE = 31;
const CHAR_HEIGHT = 40;
const CHAR_WIDTH = 17;

const explanation = [
    padEnd('You can always go forward.', MAX_PER_LINE),
    padEnd('Never back.', MAX_PER_LINE),
    padEnd('Everything is temporary.', MAX_PER_LINE),
    padEnd('Nothing lasts forever.', MAX_PER_LINE)
].join('');

const prompt = padEnd('Start typing:', MAX_PER_LINE);

function Typer() {
    const [stream, setStream] = useState({ chars: [] });
    const [fadeAfter, setFadeAfter] = useState(explanation.length);

    const useType = ({ key = '' } = {}) => {
        if (!key.length || key.length > 1) {
            return;
        }

        let next = stream;

        if (next.chars.length === MAX_STATE_SIZE) {
            next.chars = next.chars.slice(MAX_CHAR_COUNT, MAX_STATE_SIZE);
        }

        next.chars = [...next.chars, { key, id: uniqueId() }];
        setStream(next)
    }

    const say = (phrase, cb) => {
        Array.prototype.forEach.call(phrase, (key, i) => {
            setTimeout(() => {
                useType({ key });

                if (i === phrase.length - 1) { cb(); }
            }, i *  50);
        });
    }

    const showPrompt = () => {
        setFadeAfter(MAX_PER_LINE);

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

                    const lineNumber = Math.floor((i / MAX_PER_LINE) % LINE_COUNT);

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