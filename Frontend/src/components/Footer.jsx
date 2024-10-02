import React from "react";
import Iframe from "react-iframe"

function Footer()
{
    return <>
    <div class="bg-slate-700 py-6">
    <div id="footer" class="container mx-auto text-gray-200">
        <div id="grid" class="grid grid-cols-3 justify-center text-center">
            <div id="fb-page" class="py-4">
                <div class="text-2xl font-bold">Facebook Page</div>
                <div class="py-4">
                    <div>
                        <Iframe src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fvckyracingshop&tabs=timeline&width=400&height=200&small_header=false&adapt_container_width=false&hide_cover=false&show_facepile=true&appId" width="400" height="200" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"/>
                    </div>
                </div>
            </div>
            <div id="googlemap" class="py-4">
                <div class="text-2xl font-bold">Google Map</div>
                <div class="py-4">
                    <Iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d247794.69523511943!2d100.03556679453122!3d13.970976199999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e28c0784a586bf%3A0x9f5688451e16e72c!2z4Lin4Li04LiK4Lix4Lii4LiB4Liy4Lij4Lii4Liy4LiHdmNrc2hvcOC4reC4ueC5iOC5g-C4q-C4oeC5iA!5e0!3m2!1sth!2sth!4v1721076138569!5m2!1sth!2sth" width="400" height="200" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" />
                </div>
            </div>
            <div id="contact" class="py-4">
                <div class="text-2xl font-bold">ติดต่อสอบถาม
                    <div class="grid grid-rows-4 text-left py-4">
                        <div class="text-xl font-normal">LINE ID : bankchevy</div>
                        <div class="text-xl font-normal">Facebook : วิชัยการยางVCKRacingShop</div>
                        <div class="text-xl font-normal">Tel: 0830123675 BANK</div>
                        <div class="text-xl font-normal">ที่อยู่ : ถ. บางกรวย - กรุงเทพ ตำบลไทรน้อย อำเภอไทรน้อย นนทบุรี 11150</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
    </>
    
}

export default Footer