import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { countries } from 'country-data-list';
import axios from 'axios';

const vctr = {
    notFound: require("../Images/notfound_img.svg").default,
    bg_image: require("../Images/Game_BG.png"),
    cap_logo: require("../Images/cap-logo.png"),
};

function Form() {
    const nav = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        country: '',
    });

    const [validationErrors, setValidationErrors] = useState({
        email: '',
        phone: '',
        addCustomer: '',
    });

    const [loading, setLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);


    const countryArr = Object.values(countries);
    const countryOptions = countryArr?.[0]?.map(country => {
        return {
            label: `${country?.countryCallingCodes?.[0]} (${country.name})`,
            value: country?.countryCallingCodes?.[0]?.split("+")?.[1]
        }
    }
    )

    const handleInputChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value,
        });

        // Clear validation errors when the user starts typing
        setValidationErrors({
            ...validationErrors,
            [name]: '',
        });
    };

    const validateForm = () => {
        let isValid = true;
        const newValidationErrors = {};

        // Email validation using regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email || !emailRegex.test(formData.email)) {
            newValidationErrors.email = 'Invalid email address';
            isValid = false;
        }

        // Phone validation using regex
        const phoneRegex = /^(\+[1-9]\d{0,2})?(?:[0-9] ?){6,14}[0-9]$/;
        if (!formData.phone || !phoneRegex.test(`${formData.country}${formData.phone}`)) {
            newValidationErrors.phone = 'Invalid phone number';
            isValid = false;
        }

        if (!formData.country) {
            newValidationErrors.country = 'Please select a country';
            isValid = false;
        }

        // Set validation errors
        setValidationErrors(newValidationErrors);
        return isValid;
    };


    // add user -> generate token -> get campaign url -> store the url in localStorage.
    const AddCustomer = async () => {
        try {
            setLoading(true);
            let customerData = JSON.stringify({
                "method": "CUSTOMERADD",
                "postData": {
                    "root": {
                        "customer": [
                            {
                                "mobile": `${formData.country}${formData.phone}`,
                                "email": `${formData.email}`,
                                "external_id": "phone",
                                "source": "INSTORE",
                                "type": "LOYALTY"
                            }
                        ]
                    }
                }
            });

            let customerConfig = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://demoapps.capillarytech.com/wrapper/games/api.php',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: customerData
            };

            const customerResponse = await axios.request(customerConfig);
            if (customerResponse?.data?.response?.status?.code === 200) {
                let data = JSON.stringify({
                    "userId": `${formData.country}${formData.phone}`,
                    "writeKey": "dc2a1eb9643226559d07d6c080e5d5f1a3dbbb1a"
                });

                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'https://api.customerglu.com/user/v1/user/sdk?token=true',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };
                axios.request(config)
                    .then((response) => {
                        if (response?.data?.data?.token) {
                            let config = {
                                method: 'get',
                                maxBodyLength: Infinity,
                                url: 'https://api.customerglu.com/reward/v1.1/user?campaignId=b0ab89fe-826a-4eb6-9a4f-a3ef4ea97f53',
                                headers: {
                                    'Authorization': `Bearer ${response?.data?.data?.token}`
                                }
                            };
                            axios.request(config)
                                .then((response) => {
                                    if (response?.data?.campaigns?.[0]?.url) {
                                        setLoading(false);
                                        localStorage.setItem("campaignUrl", response?.data?.campaigns?.[0]?.url);
                                        setSubmitStatus('success');
                                    } else {
                                        setSubmitStatus("error");
                                        setValidationErrors({
                                            ...validationErrors,
                                            addCustomer: 'Customer registration failed, pls try again.',
                                        });
                                    }
                                })
                                .catch((error) => {
                                    console.log(error);
                                });
                        } else {
                            setSubmitStatus("error");
                            setValidationErrors({
                                ...validationErrors,
                                addCustomer: 'Customer registration failed, pls try again.',
                            });
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            } else {
                setSubmitStatus("error");
                setValidationErrors({
                    ...validationErrors,
                    addCustomer: 'Customer registration failed, pls try again.',
                });
            }

        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            setSubmitStatus('error');
            return;
        }
        AddCustomer();
    };

    useEffect(() => {
        if (submitStatus === 'success') {
            setTimeout(()=>{nav(`/play?email=${formData?.email}&phone=${formData?.country}${formData?.phone}`)},2250)
            // nav(`/play?email=${formData?.email}&phone=${formData?.country}${formData?.phone}`);
        }
        if (submitStatus === 'error') {
            setLoading(false);
        }
        const user = sessionStorage.getItem("user");
        if (user) {
            sessionStorage.removeItem('user');
        }
    }, [submitStatus, formData, nav]);

    return (
        <div className="flex flex-col items-center justify-start min-h-screen p-6 bg-[#5799DA]" style={{ backgroundImage: `url(${vctr.bg_image})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
            <div className="flex justify-center mt-4">
                <img src={vctr.cap_logo} className="h-10" alt="Logo" />
            </div>
            <form
                className="flex flex-col items-center gap-4 p-6 mt-[15vh] bg-white rounded shadow bg-opacity-40"
                onSubmit={handleSubmit}
            >
                <h2 className="mb-4 text-xl font-bold text-center text-red-800 md:text-2xl">
                    Join our Gaming Madness Campaign
                </h2>
                <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full p-2 mb-1 rounded"
                    placeholder="Email"
                />
                {validationErrors.email && (
                    <p className="font-semibold text-red-600">{validationErrors.email}</p>
                )}
                <Select
                    className='w-full'
                    options={countryOptions.filter(country => country?.value !== undefined)}
                    value={countryOptions.find(co => co.value === formData.country)}
                    onChange={selected => {
                        setFormData({
                            ...formData,
                            country: selected.value
                        })
                    }}
                    placeholder="Country Code"
                />
                {validationErrors.country && (
                    <p className="font-semibold text-red-600 ">{validationErrors.country}</p>
                )}
                <input
                    required
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full p-2 mb-2 rounded"
                    placeholder="Phone"
                />
                {validationErrors.phone && (
                    <p className="font-semibold text-red-600 ">{validationErrors.phone}</p>
                )}
                {validationErrors.addCustomer && (
                    <p className="font-semibold text-red-600 ">{validationErrors.addCustomer}</p>
                )}
                <button
                    className="block font-bold px-4 py-2 mt-4 text-white bg-[#1F9A1D] rounded hover:bg-green-500 focus:outline-none"
                >
                    {loading ? `Game is loading...` : "Continue"}
                </button>
            </form>
        </div>
    );
}
export default Form;
