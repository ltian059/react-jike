import React, { useEffect, useRef } from 'react';
import Quill, { Delta } from 'quill';
import './index.scss'
import 'quill/dist/quill.snow.css'
// Editor is an uncontrolled React component

/* 要在antd的form中使用，需要将editor组件修改为受控组件， 即带有value和onChange */
const Editor =
    ({ value, initialValues, onChange }) => {
        const containerRef = useRef(null);
        const quillRef = useRef(null);


        // 初始化quill
        useEffect(() => {
            const container = containerRef.current;
            const editorContainer = container.appendChild(
                container.ownerDocument.createElement('div'),
            );
            const quill = new Quill(editorContainer, {
                theme: 'snow',
            });
            quillRef.current = quill;
            if (initialValues) {
                quill.setContents(initialValues);
            }

            //监听文本变化
            quill.on(Quill.events.TEXT_CHANGE, (...args) => {
                // arg1: delta , arg2: oldDelta, arg3: source
                const content = quill.getContents();
                onChange?.(content);
                // onTextChangeRef.current?.(quill.getContents());

            });

            return () => {
                quillRef.current = null;
                container.innerHTML = '';
            };
        }, [initialValues]);

        //监听外部数据变化，用于更新quill内容
        useEffect(() => {
            const quill = quillRef.current;
            if (quill && value) {
                if (typeof value === 'string') {
                    const delta = quill.clipboard.convert({ html: value })
                    quill.setContents(delta, 'silent')
                }
                else {
                    if (JSON.stringify(value) !== JSON.stringify(quill.getContents())) {
                        console.log(typeof value);
                        quill.setContents(value);
                    }
                }
            }
        }, [value]);

        return <div ref={containerRef}></div>;
    };

Editor.displayName = 'Editor';

export default Editor;