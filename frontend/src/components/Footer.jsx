const Footer = () => {
    return (
        <footer className="bg-gray-800">
            <div className="max-w-6xl mx-auto py-4 px-4 sm:px-6 lg:py-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div>
                        <img className="h-8" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2B9LswCEh3jElEIiDsU4C60RTU3Chlv-h2A&s" alt="CertiMeet" />
                        <p className="mt-4 text-gray-300 text-base">
                            CertiMeet simplifies your workflow by seamlessly combining certificate generation and meeting scheduling into a single, user-friendly platform. Whether you’re organizing events, managing teams, or handling certifications, CertiMeet ensures efficiency and professionalism at every step.
                        </p>
                        <div className="mt-4 flex space-x-6">
                            <a href="#" className="text-gray-400 hover:text-gray-300">
                                <i className="fab fa-twitter text-xl"></i>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-gray-300">
                                <i className="fab fa-linkedin text-xl"></i>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-gray-300">
                                <i className="fab fa-github text-xl"></i>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-gray-300">
                                <i className="fab fa-instagram text-xl"></i>
                            </a>
                        </div>
                    </div>

                    <div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Contact</h3>
                            <ul className="mt-4 list-disc list-inside text-base text-gray-300">
                                <li>Computer Science Department</li>
                                <li>Comsats University</li>
                                <li>Park Road, Islamabad</li>
                                <li>aka.mdrana@gmail.com</li>
                                <li>+92-305-216-XXXX</li>
                            </ul>
                        </div>

                        <div className="mt-6 flex space-x-4">
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                                <svg className="w-6 h-6 text-gray-300 hover:text-white" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.783-1.75-1.732s.784-1.732 1.75-1.732 1.75.783 1.75 1.732-.784 1.732-1.75 1.732zm13.5 11.268h-3v-5.604c0-3.337-4-3.074-4 0v5.604h-3v-10h3v1.525c1.396-2.586 7-2.777 7 2.476v6z" />
                                </svg>
                            </a>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                                <svg className="w-6 h-6 text-gray-300 hover:text-white" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577v-2.243c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-.424-.729-.666-1.577-.666-2.482 0-1.71.87-3.213 2.188-4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.388 1.699 4.384 3.95 4.835-.414.111-.849.171-1.296.171-.317 0-.626-.03-.928-.087.627 1.956 2.445 3.379 4.604 3.419-1.685 1.321-3.808 2.107-6.115 2.107-.397 0-.788-.023-1.175-.068 2.179 1.396 4.768 2.21 7.548 2.21 9.054 0 14-7.498 14-13.986 0-.213-.005-.425-.014-.637.961-.695 1.8-1.562 2.46-2.549z" />
                                </svg>
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                                <svg className="w-6 h-6 text-gray-300 hover:text-white" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.611 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.896-.957-2.173-1.555-3.594-1.555-2.722 0-4.927 2.206-4.927 4.927 0 .386.044.762.127 1.124-4.094-.205-7.725-2.167-10.157-5.144-.424.729-.666 1.577-.666 2.482 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.388 1.699 4.384 3.95 4.835-.414.111-.849.171-1.296.171-.317 0-.626-.03-.928-.087.627 1.956 2.445 3.379 4.604 3.419-1.685 1.321-3.808 2.107-6.115 2.107-.397 0-.788-.023-1.175-.068 2.179 1.396 4.768 2.21 7.548 2.21 9.054 0 14-7.498 14-13.986 0-.213-.005-.425-.014-.637.961-.695 1.8-1.562 2.46-2.549z" />
                                </svg>
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                <svg className="w-6 h-6 text-gray-300 hover:text-white" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.331 3.608 1.308.974.978 1.244 2.246 1.308 3.608.058 1.265.068 1.645.068 4.851s-.01 3.586-.068 4.851c-.064 1.362-.334 2.63-1.308 3.608-.975.977-2.242 1.246-3.608 1.308-1.266.058-1.645.068-4.851.068s-3.585-.01-4.851-.068c-1.362-.064-2.63-.334-3.608-1.308-.977-.975-1.246-2.243-1.308-3.608-.058-1.265-.068-1.645-.068-4.851s.01-3.585.068-4.851c.064-1.362.334-2.63 1.308-3.608.978-.977 2.246-1.246 3.608-1.308 1.265-.058 1.645-.068 4.851-.068zm0-2.163c-3.257 0-3.667.012-4.947.072-1.529.07-2.876.41-3.968 1.502-1.092 1.092-1.432 2.439-1.502 3.968-.06 1.28-.072 1.69-.072 4.947s.012 3.667.072 4.947c.07 1.529.41 2.876 1.502 3.968 1.092 1.092 2.439 1.432 3.968 1.502 1.28.06 1.69.072 4.947.072s3.667-.012 4.947-.072c1.529-.07 2.876-.41 3.968-1.502 1.092-1.092 1.432-2.439 1.502-3.968.06-1.28.072-1.69.072-4.947s-.012-3.667-.072-4.947c-.07-1.529-.41-2.876-1.502-3.968-1.092-1.092-2.439-1.432-3.968-1.502-1.28-.06-1.69-.072-4.947-.072zm0 5.838a6.162 6.162 0 1 1 0 12.324 6.162 6.162 0 0 1 0-12.324zm0 2.014a4.149 4.149 0 1 0 0 8.298 4.149 4.149 0 0 0 0-8.298zm6.406-.832a1.44 1.44 0 1 1 0-2.881 1.44 1.44 0 0 1 0 2.881z" />
                                </svg>
                            </a>
                        </div>
                    </div>


                    <div>
                        <div className="h-64 w-full rounded-lg overflow-hidden">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2646.568068778575!2d73.15441277470502!3d33.65240797331008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfea4aee5bdf8f%3A0xe6b55e05d462beb1!2sCOMSATS%20University%20Islamabad%20(CUI)!5e1!3m2!1sen!2sus!4v1735411291978!5m2!1sen!2sus"
                                className="w-full h-full border-0"
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>

                    </div>
                </div>
                <div className="mt-8 border-t border-gray-700 pt-2">
                    <p className="text-base text-gray-400 text-center">
                        © 2024 CertiMeet. All rights reserved. Powered by{' '}
                        <a
                            href="https://mdrana.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white underline"
                        >
                            Danyal Rana
                        </a>.
                    </p>

                </div>
            </div>
        </footer>
    );
};

export default Footer;