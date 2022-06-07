import { Input, Modal } from "antd";
import React, { useCallback, useEffect, useState } from "react";

interface CardBulkEditProps {
    onUpdate: (value:string) => Promise<void>;
    visible: boolean;
    setVisible: (visible: boolean) => void;
    init: (setValue: (value: string) => void) => void;
}

export function CardBulkEdit({ onUpdate, visible, setVisible, init }: CardBulkEditProps) {
    const [value, setValue] = useState<string>('');

    useEffect(() => {
        init(setValue);
    }, [init, visible]);

    const handleOk = useCallback(async () => {
        setVisible(false);
        await onUpdate(value);
    }, [onUpdate, setVisible, value]);

    const handleCancel = useCallback(() => {
        setVisible(false);
    }, [setVisible]);
        
    return (
        <>
            <Modal visible={visible} onOk={handleOk} onCancel={handleCancel} width={1000} title='Bulk edit' okText='Save'>
                <Input.TextArea
                    value={value}
                    onChange={e => setValue(e.target.value)} 
                    autoSize={{ minRows: 2, maxRows: 20 }} />
            </Modal>
        </>
    )
}