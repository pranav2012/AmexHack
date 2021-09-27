import { Form } from 'semantic-ui-react'
import { url } from '../util/data';
import { Formik } from 'formik';
import { forgotformvalues as initialvalue } from '../util/initial-data';
import { forgotformvalidation as schema } from '../util/validations';
import FormError from '../elements/FormError';

export default function Loginform() {
    return (
        <div className="min-h-screen flex bg-gray-50 justify-center items-center">
            <div className="w-4/5 md:w-2/5 p-5 m-6 bg-white rounded shadow-lg">
                <Formik
                    initialValues={initialvalue}
                    enableReinitialize={true}
                    validationSchema={schema}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                        console.log("hey", values, url);
                        // setSubmitting(true);
                        // resetForm({ values: '' });
                    }}
                >
                    {props => {
                        const {
                            values,// eslint-disable-line
                            isSubmitting,
                            handleChange,// eslint-disable-line
                            handleBlur,// eslint-disable-line
                            handleSubmit,// eslint-disable-line
                            // setFieldValue,
                            // setFieldTouched,
                        } = props;
                        return (
                            <Form>
                                <h1 className="gray-600 text-3xl my-6 text-center font-bold">Forget Password</h1>
                                <Form.Input name="email" onChange={handleChange} onBlur={handleBlur} value={values.email} fluid label='Email' placeholder='Email' />
                                <FormError name="email" />
                                <div className="flex justify-center">
                                    <Form.Button disabled={isSubmitting} onClick={handleSubmit} color="blue">Reset Password</Form.Button>
                                </div>
                            </Form>
                        )
                    }}
                </Formik>
            </div>
        </div>
    )
}