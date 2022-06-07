import { Form, FormInstance, Input, InputRef, Table } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface EditableRowProps {
    index: number;
}
const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    )
}

interface EditableCellProps<T> {
    title: React.ReactNode;
    editable: boolean;
    children: React.ReactNode;
    dataIndex: keyof T;
    record: T;
    required: boolean;
    handleSave: (changes: Partial<T>, record: T) => void;
}

function EditableCell<T>({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    required,
    ...restProps
}: EditableCellProps<T>) {
    const [editing, setEditing] = useState<boolean>(false);
    const inputRef = useRef<InputRef>(null);
    const form = useContext(EditableContext)!;

    useEffect(() => {
        if (editing) {
            inputRef.current!.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    }

    const save = async () => {
        try {
            const values = await form.validateFields();

            toggleEdit();
            handleSave(values, { ...record, ...values });
        } catch (error) {
            console.log(error);
        }
    }

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item 
                style={{ margin: 0 }}
                name={dataIndex as any}
                rules={[
                    {
                        required,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
                {children}
            </div>
        );
    }

    return (<td {...restProps}>{childNode}</td>);
}

const components = {
    body: {
        row: EditableRow,
        cell: EditableCell,
    },
};

type EditableTableProps = Parameters<typeof Table>[0];
type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

function makeColumns<S extends ColumnTypes[number] & { editable?: boolean; dataIndex: string }, T>(columns: S[], handleSave: (changes: Partial<T>, record: T) => void) {
    return columns.map(col => {
        if (!col.editable) return col;
        return {
            ...col,
            onCell: (record: T) => ({
                record,
                editable: true,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
                required: (col as any).required || false,
            })
        }
    });
}

export { components, makeColumns };