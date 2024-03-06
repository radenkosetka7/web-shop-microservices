import {useForm} from "react-hook-form";
import './ActivateAccount.css'
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from 'react';
import {useNavigate, Link, useLocation} from "react-router-dom";
import {activateAccount} from "../../services/auth.service";

const ActivateAccount = () => {

    const {register, handleSubmit, formState: {errors}} = useForm();
    const dispatch = useDispatch();
    const nav = useNavigate();
    const [responseText, setResponseText] = useState(null);
    const [contentHeight, setContentHeight] = useState('calc(100vh - 75px)');
    const {authenticated, loading} = useSelector((state) => state.users);
    const location = useLocation();
    const user = location.state && location.state.username;
    const onSubmit = async (activateAccData) => {

        const accData = {
            code: activateAccData.code,
            username: user
        };
        const response = await activateAccount(accData);
        if (response.data === "") {
            setResponseText("Invalid code. Please try again.");
            return;
        }
        sessionStorage.setItem('access', response.data.token);
        nav('/');
    }

    useEffect(() => {
        if (authenticated)
            nav('/');
    }, [authenticated, nav, dispatch]);
    return (
        <div style={{backgroundColor: '#f3f1f1', height: contentHeight}}>
            <div className='linearGradient2'>
                <form className='form2' onSubmit={handleSubmit(onSubmit)}>
                    <p className="form-title">Activate account</p>
                    <div className="input-container">
                        <input placeholder="Code" type="text"
                               name="code" {...register("code", {
                            required: true,
                        })}

                        />
                    </div>
                    {errors.code && errors.code.type === "required" && (
                        <p className='error'>Code is required</p>)}

                    {
                        responseText &&
                        <p className='error' style={{maxWidth: "250px"}}>
                            {responseText}
                        </p>

                    }
                    <button className='submit' type="submit" disabled={loading}>
                        {loading ? 'Loading...' : 'Submit'}
                    </button>
                </form>
            </div>
        </div>
    );
}
export default ActivateAccount;
