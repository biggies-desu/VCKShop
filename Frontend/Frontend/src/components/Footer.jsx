import React from "react";
import Iframe from "react-iframe"

import '../index.css'

function Footer()
{
    return <>
    <div className="w-full bg-gray-800 text-gray-200 kanit-regular">
    <div id="footer" className="container mx-auto px-4">
        <div
            id="grid"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 justify-items-center items-start text-center"
        >
            {/* Facebook Page Section */}
            <div id="fb-page" className="rounded-lg p-3 md:p-4 w-full max-w-sm">
                <div className="text-lg md:text-xl font-bold mb-3">
                    Facebook Page
                </div>
                <Iframe
                    src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fvckyracingshop&tabs=timeline&width=400&height=200&small_header=false&adapt_container_width=false&hide_cover=false&show_facepile=true&appId"
                    width="100%"
                    height="200"
                    style="border:none;overflow:hidden"
                    scrolling="no"
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                />
            </div>

            {/* Google Map Section */}
            <div id="googlemap" className="rounded-lg p-3 md:p-4 w-full max-w-sm">
                <div className="text-lg md:text-xl font-bold mb-3">
                    Google Map
                </div>
                <Iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d247794.69523511943!2d100.03556679453122!3d13.970976199999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e28c0784a586bf%3A0x9f5688451e16e72c!2z4Lin4Li04LiK4Lix4Lii4LiB4Liy4Lij4Lii4Liy4LiHdmNrc2hvcOC4reC4ueC5iOC5g-C4q-C4oeC5iA!5e0!3m2!1sth!2sth!4v1721076138569!5m2!1sth!2sth"
                    width="100%"
                    height="200"
                    style="border:0;"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </div>

            {/* Contact Section */}
            <div id="contact" className="rounded-lg p-3 md:p-4 w-full max-w-sm">
                <div className="text-lg md:text-xl font-bold mb-3">
                    ติดต่อสอบถาม
                </div>
                <div className="text-left space-y-2 md:space-y-3 md:text-base">
                    <div>
                        <i className="fab fa-line">
                            <span className="kanit-regular"> : bankchevy</span>
                        </i>
                    </div>
                    <div>
                        <i className="fab fa-facebook-f">
                            <span className="kanit-regular"> : วิชัยการยางVCKRacingShop</span>
                        </i>
                    </div>
                    <div>
                        <i className="fas fa-phone">
                            <span className="kanit-regular"> : 083-012-3675 BANK</span>
                        </i>
                    </div>
                    <div>
                        <i class="fa fa-envelope">
                            <span className="kanit-regular"> : viosza@hotmail.com</span>
                        </i>
                    </div>
                    <div>
                        <i className="fas fa-location-arrow">
                            <span className="kanit-regular">
                                : วิชัยการยางVCKShop  ถนน  บางกรวย - กรุงเทพ ตำบลไทรน้อย อำเภอไทรน้อย นนทบุรี 11150
                            </span>
                        </i>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <footer className="bg-gray-800 text-gray-200 py-4 text-center">
        <p>&copy; 2025 วิชัยการยาง VCKShop. All Rights Reserved.</p>
    </footer>
    </div>
    </>
}

export default Footer