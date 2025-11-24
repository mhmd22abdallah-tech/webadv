import React,{useRef} from "react";

import emailjs from '@emailjs/browser';

function Contact(){
   
    const form = useRef();
        const sendEmail = (e) => {
          e.preventDefault();
      
          emailjs
            .sendForm('service_87l8dg7', 'template_j80z4ka', form.current, {
              publicKey: 'OnskWjOarmzNMkC15',
            })
            .then(
              () => {
                console.log('SUCCESS!');
              },
              (error) => {
                console.log('FAILED...', error.text);
              },
            );
        };
    return(
        <div className="container">
                 <section class="py-5 wow fadeInUp" data-wow-delay="0.1s" id="contact">
                        <h1 class="title pb-3 mb-5 text-center text-danger">Contact Me</h1>
		
                        <form id="contact-form" ref={form} onSubmit={sendEmail}>
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <div class="form-floating">
                                        <input type="text" class="form-control border-0 " name="from_name" id="from_name" placeholder="Your Name" />
                                        <label for="name">Your Name</label>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-floating">
                                        <input type="email" class="form-control border-0 " name="from_email" id="email" placeholder="Your Email" />
                                        <label for="email">Your Email</label>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="form-floating">
                                        <input type="text" class="form-control border-0 " name="subject" id="subject" placeholder="Subject" />
                                        <label for="subject">Subject</label>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="form-floating">
                                        <textarea class="form-control border-0 " name="message" placeholder="Leave a message here" id="message" ></textarea>
                                        <label for="message">Message</label>
                                    </div>
                                </div>
                                <input type="hidden" name="captcha" value="false" />
                                <div class="col-12">
                                    <button class="btn btn-danger w-100 py-3" type="submit">Send Message</button>
                                </div>
                            </div>
                        </form>
                    </section>
                    </div>
                    

        
       
        
       

      )
      }
export default Contact;