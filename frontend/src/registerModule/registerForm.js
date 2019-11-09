import React,{useState} from 'react';
import './registerForm.css';
import {useSelector} from "react-redux";
import {Redirect} from "react-router-dom";
import history from "../history";

function RegisterForm() {

    const [form, setForm] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        name: '',
        surname: '',
        email: '',
        phone: '',
        physicalAddress: '',
        location: '',
        country: '',
        afm: ''
    });

    const getValues = e => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const isLogged = useSelector(state => state.isLogged);
    async function registerDb(e){
        e.preventDefault();
        console.log(form.username, form.password);
        const response = await fetch(`https://localhost:3001/register`, {
                method: 'Post',
                credentials: "include",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userName: form.username,
                    password: form.password,
                    confirmPassword: form.confirmPassword,
                    name: form.name,
                    surName: form.surname,
                    email: form.email,
                    phoneNumber: form.phone,
                    physicalAddress: form.physicalAddress,
                    location: form.location,
                    country:form.country,
                    afm: form.afm
                })
            },
        );
        const data = await response.json();
        console.log('o server mas epestrepse ' + data);
        if(!(data === 'Successfully created an account'))
            alert(data);
        else{
            history.push('/');
            window.location.reload();
        }
    }
    const guestLinks=(
        <div className="register-form">
            <h1 className='title-register-form'>Create an account</h1>
            <form className="form">
                <input type="text" name="username" placeholder="Username" required className="reg-username" value={form.username} onChange={getValues}/>
                <input type="password" name="password" placeholder="Password" required className="reg-password" value={form.password} onChange={getValues}/>
                <input type="password" name="confirmPassword" placeholder="Confirm Password" required className="reg-repassword" value={form.confirmPassword} onChange={getValues}/>
                <input type="text" name="name" placeholder="Name" required className="reg-name" value={form.name} onChange={getValues}/>
                <input type="text" name="surname" placeholder="Surname" required className="reg-surname" value={form.surname} onChange={getValues}/>
                <input type="email" name="email" placeholder="E-mail" required className="reg-email" value={form.email} onChange={getValues}/>
                <input type="tel" name="phone" placeholder="Phone Number" required className="reg-phone" value={form.phone} onChange={getValues}/>
                <input type="text" name="physicalAddress" placeholder="Address" required className="reg-address" value={form.physicalAddress} onChange={getValues}/>
                <input type="text" name="location" placeholder="Location" required className="reg-location" value={form.location} onChange={getValues}/>
                <input type="text" name="country" placeholder="Country" required className="reg-country" value={form.country} onChange={getValues}/>
                <input type="text" name="afm" placeholder="Tax Registration Number" className="reg-taxnum" value={form.afm} onChange={getValues}/>
                <input type="submit" value="Submit" className="buttonSubmit" onClick={registerDb}/>
            </form>
        </div>
    );

    const userLinks=(
        <Redirect to='/'/>
    );

    return (
        <div>
            {isLogged ? userLinks : guestLinks}
        </div>
    );
}

export default RegisterForm;