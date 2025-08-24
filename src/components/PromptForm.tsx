import { useState, useEffect } from 'react';
import axios from 'axios';

interface PromptPostViewModel {
    promptId: string;
    parameters: string;
}

// Interface for field configuration from backend
interface FormField {
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'number' | 'email' | 'password' | 'select';
    required?: boolean;
    placeholder?: string;
    options?: { value: string; label: string }[];
}

function PromptForm() {
    const [text, setText] = useState('');
    const [response, setResponse] = useState<string>('');
    const [fields, setFields] = useState<FormField[]>([]);

    // Fetch field configuration from backend
    useEffect(() => {
        const fetchFields = async () => {
            try {
                const response = await axios.get(
                    'https://localhost:7256/api/forms/fields'
                );
                setFields(response.data.fields || response.data);
            } catch (err) {
                console.error('Error fetching form fields:', err);
                // Fallback to default field if backend fails
                setFields([
                    {
                        name: 'text',
                        label: 'Enter text',
                        type: 'text',
                        required: true,
                    },
                ]);
            }
        };

        fetchFields();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const payload: PromptPostViewModel = {
                promptId: '6b29fc40-ca47-1067-b31d-00dd010662da', // you can make this dynamic if needed
                parameters: text,
            };

            const res = await axios.post(
                'https://localhost:7256/api/gemini/index',
                payload,
                { headers: { 'Content-Type': 'application/json' } }
            );

            console.log(res.data);
            setResponse(res.data.content);
            setText(''); // clear input after send
        } catch (err) {
            console.error(err);
            setResponse('Error sending request');
        }
    };

    return (
        <div className='container py-4'>
            <div className='row justify-content-center'>
                <div className='col-lg-8'>
                    <div className='card shadow-sm'>
                        <div className='card-body p-4'>
                            <h2 className='card-title text-center mb-4'>
                                AI Assistant
                            </h2>
                            <form onSubmit={handleSubmit}>
                                {fields.map((field) => (
                                    <div key={field.name} className='mb-3'>
                                        <label
                                            htmlFor={field.name}
                                            className='form-label fw-semibold'
                                        >
                                            {field.label}
                                        </label>
                                        <input
                                            id={field.name}
                                            type={field.type}
                                            value={text}
                                            onChange={(e) =>
                                                setText(e.target.value)
                                            }
                                            required={field.required}
                                            placeholder={field.placeholder}
                                            className='form-control form-control-lg'
                                        />
                                    </div>
                                ))}
                                <button
                                    type='submit'
                                    className='btn btn-primary btn-lg w-100 mt-3'
                                >
                                    Send Request
                                </button>
                            </form>
                        </div>
                    </div>

                    {response && (
                        <div className='card shadow-sm mt-4'>
                            <div className='card-body p-4'>
                                <h3 className='card-title mb-3'>Response</h3>
                                <div
                                    className='response-content'
                                    dangerouslySetInnerHTML={{
                                        __html: response,
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PromptForm;
