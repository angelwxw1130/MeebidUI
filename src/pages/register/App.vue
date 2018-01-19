<template>
  <div id="app" class="meebidHomePage meebid">
    <div id="header" class="meebidAdminHeader meebidRegisterHeader">
      <div class="meebidHeaderButtonToolbar">
        <meebid-button wrapper-cls="homeWrapper" button-type="round" text="Home" :button-click="redirectToHome">
        </meebid-button>
      </div>
    </div>
    <div class="meebidRegisterHeaderText">Log In or Create Account</div>
    <div id="content" class="meebidRegisterContent" >
      
      <el-row>
        <el-col :span="12" class="meebidLoginFormWrapper">
          <div class="meebidLoginDialogLabel meebidRegisterHeaderLabel">Returning User</div>
          <div class="meebidRegisterHeaderLabel">Existing MEEBID.COM members, please sign in with your email address and password here.</div>
          <el-form ref="loginForm" status-icon :rules="loginFormRules" :model="loginForm" label-width="150px">
            <el-form-item label="Email" prop="email">
              <el-input v-model="loginForm.email" auto-complete="new-password"></el-input>
            </el-form-item>
            <el-form-item label="Password" prop="password">
              <el-input v-model="loginForm.password" type="password" auto-complete="new-password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onLogin">LOGGED IN</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12" class="meebidRegisterFormWrapper">
          <div class="meebidLoginDialogLabel meebidRegisterHeaderLabel">New Users</div>
          <div class="meebidRegisterHeaderLabel">Create an account to join Meebid.</div>
          <el-form ref="form" status-icon :rules="formRules" :model="form" label-width="150px" >
            <el-form-item label="Register Type" prop="type">
              <el-radio-group v-model="form.type">
                <el-radio label="member">Member User</el-radio>
                <el-radio label="house">Auction House User</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="Email" prop="email">
              <el-input v-model="form.email" auto-complete="new-password"></el-input>
            </el-form-item>
            <el-form-item label="Password" prop="password">
              <el-input v-model="form.password" type="password" auto-complete="new-password"></el-input>
            </el-form-item>
            <el-form-item label="Confirm Password" prop="confirmPassword">
              <el-input v-model="form.confirmPassword" type="password" auto-complete="new-password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">REGISTER & CONTINUE</el-button>
            </el-form-item>
            <el-form-item>
              By clicking "Register & Continue" I agree to this auction's <el-button type="text" size="mini" @click="showTermConditionDialog">Terms and Conditions.</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      
      
    </div>
    <meebid-busy-indicator ref="busyIndicator" size="Medium"></meebid-busy-indicator>
    <el-dialog
      title="Terms and Condition"
      :visible.sync="ruleDialogVisible"
      class=""
      width="500px">
      
        <td width="700" align="left">
          <div style="font-size:14px;"><br>
          INVALUABLE, INVALUABLE LIVE AUCTIONS AND INVALUABLE TIMED AUCTIONS TERMS OF USE<br>
          AGREEMENT<br><br>
          <br>
          This document describes terms and conditions applicable to your use of the<br>
          services made available by Invaluable, LLC ("Invaluable"<br>
          "we," or "us") at the websites www.Invaluable.com,<br>
          www.AuctionZip.com, and Infinite Bidding Sites (the "Sites").<br><br>
          <br>
          Section 1. General.<br><br>
          <br>
          1.1 Services. This Terms and Conditions of Use Agreement (hereafter this<br>
          "Agreement") sets forth the general terms and conditions that apply<br>
          to the use by you of the Sites, including the features and services offered by<br>
          us from time to time at or through the Sites (collectively with the Sites, the<br>
          "Services"). BY USING THE SERVICES, YOU AGREE TO THE TERMS AND<br>
          CONDITIONS CONTAINED HEREIN. This Agreement is a legally binding instrument<br>
          between you and Invaluable, and describes your responsibilities in connection<br>
          with your use of the Services and, among other things, limits the liability of Invaluable.<br>
          Before using any of the Services, please read all of this Agreement carefully.<br>
          By accessing or using any Services, you affirm that you are over 18 years of<br>
          age and are otherwise capable of forming legally binding contracts, and that<br>
          you agree to be legally bound and to abide by this Agreement. If you are under<br>
          18 years of age, or are otherwise incapable of forming legally binding<br>
          contracts, or do not agree with any part of this Agreement, YOU MUST NOT ACCESS<br>
          OR USE THE SERVICES.<br><br>
          <br>
          1.2 Amendments. We reserve the right, exercisable in our sole discretion, to<br>
          change, modify, add to, subtract from, or otherwise amend the terms and<br>
          conditions of this Agreement at any time. Except as otherwise stated below, all<br>
          changes, modifications, or other amendments shall be effective on a prospective<br>
          basis once they are posted on our Sites. This Agreement may not otherwise be<br>
          amended except in a writing signed by you and Invaluable. Continued use of the<br>
          Services by you constitutes your binding acceptance of this Agreement,<br>
          including any changes or modifications made by us as described above. You agree<br>
          to review the terms and conditions of this Agreement periodically to become<br>
          aware of such revisions and to review your compliance with them. If at any time<br>
          the terms and conditions of this Agreement are no longer acceptable to you, you<br>
          must immediately cease all use of the Services. The right to access and use the<br>
          Services is personal to you and is not transferable to any other person or entity.<br><br>
          <br>
          1.3 Additional Agreements. The Services include, among other things, such<br>
          services as: contacting or placing bids with auction houses by email or through<br>
          a live bidding console; searching and accessing past and upcoming auction<br>
          records including, when available, object photos and estimated and realized<br>
          prices; looking up or searching for artist information including biographies,<br>
          examples of art work, and other sources of information about the artist;<br>
          registering to receive email alerts about objects offered at upcoming auctions,<br>
          and emailing an antique object to a friend. Additional terms and conditions of<br>
          use applicable to your use of the Services available at the Sites from time to<br>
          time are or may be posted in relevant areas within the Sites or may be agreed<br>
          upon by you and Invaluable in a separate written agreement (e.g. Subscription<br>
          Agreement; Privacy Policy; auction house conditions of sale; all such<br>
          additional terms and conditions, "Additional Agreements"). Together<br>
          with this Agreement, such Additional Agreements will govern your use of those<br>
          Services or any other services made available by us to you. We reserve the<br>
          right, exercisable at our discretion, to change or discontinue without prior<br>
          notice some or all of the Services we provide from time to time at the Sites,<br>
          or change the applicable terms and conditions for your use of such Services as<br>
          set forth in the Additional Agreements. Without limiting any of the foregoing,<br>
          the following policies and agreements are hereby incorporated into this<br>
          Agreement by reference and provide additional terms and conditions related to<br>
          specific Services offered on the Sites: Invaluable Subscription Agreement<br>
          (http://www.Invaluable.com/agreements/subTerms.cfm) and Invaluable Privacy<br>
          Policy (http://www.Invaluable.com/agreements/privacy.cfm). In case of any<br>
          conflict between this Agreement and any Additional Agreements, this Agreement<br>
          will control.<br><br>
          <br>
          1.4 Your Account is identified by the email address you provided and you are<br>
          the only party authorized to use your user ID (email address). You are<br>
          responsible for maintaining the confidentiality of your registered account with<br>
          us and any password(s) you have chosen or we may issue to you in connection<br>
          with your access and use of the Services. You are responsible for all uses of<br>
          your account, whether or not actually or expressly authorized by you. If you<br>
          believe that your account and/or password(s) have been misused or compromised<br>
          in any manner, please contact us immediately at support@Invaluable.com.<br><br>
          <br>
          1.5 Covenant Regarding Your Account. You agree that you will not maintain<br>
          multiple registered accounts with us without our express written consent. If<br>
          you wish to maintain a multiple account, you may submit a request to do so to<br>
          support@Invaluable.com, including your primary User Name and your rationale for<br>
          having multiple accounts.<br><br>
          <br>
          1.6 Equipment. You shall be solely responsible for obtaining and maintaining<br>
          all telephone, communications, computer hardware and other equipment needed for<br>
          access to and use of the Services and all charges of any description arising<br>
          from or relating thereto.<br><br>
          <br>
          1.7 Invaluable not involved in auctions/release. We are not involved in actual<br>
          transactions between users of the Sites or any "External Sites" as<br>
          defined in section 5.1 below (whether such users are auction houses,<br>
          appraisers, art or antiques dealers, trade members, curators, educators,<br>
          antiques professionals, collectors or other third parties affiliated with Invaluable).<br>
          We have no control over the quality or legality of the items displayed on our<br>
          Sites or the truth or accuracy of the descriptions of such items, upcoming<br>
          auction events or auction results displayed on our Sites. In the event that you<br>
          have a dispute with any parties arising out of your use of the Sites you hereby<br>
          release Invaluable from claims, demands and damages (actual and consequential)<br>
          of every kind and nature, known and unknown, suspected and unsuspected,<br>
          disclosed and undisclosed, arising out of or in any way connected with such<br>
          disputes. <br><br>
          <br>
          2. Live and Timed Auctions Participation. THE FOLLOWING DESCRIBES THE TERMS ON <br><br>
          WHICH INVALUABLE OFFERS YOU ACCESS TO BID ONLINE AT LIVE AND TIMED AUCTIONS<br>
          CONDUCTED BY PARTICIPATING AUCTION HOUSES AND LICENSED AUCTIONEERS<br>
          ("AHs").<br><br>
          <br>
          2.1 Invaluable only a venue. Notwithstanding section 1.7 above, we are not an<br>
          auction house and are not conducting the live and timed auctions. Our service<br>
          allows you to participate in live and timed auctions conducted by the AHs. We<br>
          are solely a passive conduit to facilitate communication between you and the<br>
          AH. We reserve the right in our sole discretion to change some or all of our<br>
          services at any time. <br><br>
          <br>
          2.1.01 Control. We have no control over the quality, safety or legality of the<br>
          items advertised, the truth or accuracy of the listings, the ability of AHs to<br>
          sell or the ability of buyers to buy items. We do not ensure that a buyer or<br>
          seller will actually complete a transaction.<br><br>
          <br>
          2.1.02 Release. Notwithstanding section 1.7 above, because we are not involved<br>
          in the actual transaction between buyers and AHs, in the event that you have a<br>
          dispute with an AH, you release Invaluable (and our officers, directors,<br>
          agents, parent, subsidiaries, joint ventures, and employees) from claims,<br>
          demands and damages (actual and consequential) of every kind and nature, known<br>
          and unknown, suspected and unsuspected, disclosed and undisclosed, arising out<br>
          of or in any way connected with such disputes. If you are a California<br>
          resident, you waive California Civil Code Section 1542, which says: "A<br>
          general release does not extend to claims which the creditor does not know or<br>
          suspect to exist in his favor at the time of executing the release, which if<br>
          known by him must have materially affected his settlement with the<br>
          debtor." <br><br>
          <br>
          2.2 Eligibility. Each AH that conducts a live or timed auction will have its<br>
          own eligibility requirements that must be met in order for you to participate<br>
          in that auction. You may be required to apply for and obtain approval in order<br>
          to participate in a specific live or timed auction, including in some cases<br>
          providing credit card information if you have not done so previously. You agree<br>
          to maintain at all times the accuracy of your account information including<br>
          contact information, addresses and credit card information, and to allow us to<br>
          provide any of your account information to AHs whenever necessary, including<br>
          for participating in auctions. Approval to participate in one live or timed<br>
          auction does not guarantee approval to participate in any other live or timed<br>
          auction, conducted either by that AH, or another AH. Each AH has sole<br>
          discretion to refuse to approve your eligibility for any live or timed auction.<br>
          <br>
          <br><br>
          2.3 Fees. Each AH may charge a buyer's premium (which is an additional fee that<br>
          a winning bidder is required to pay above the auction price) as well as other<br>
          shipping, handling, and other fees including applicable taxes, if any. AHs may<br>
          facilitate shipping through a third-party, however in all cases, the buyer will<br>
          pay applicable shipping charges unless otherwise noted in the AH terms and<br>
          conditions. These fees are subject to change depending upon the AH and the<br>
          particular item for sale, and are set by the AH. A fee is charged for all<br>
          online purchases using the Service which will be in addition to the AH charges<br>
          unless otherwise noted in the AH terms and conditions. By using the Services,<br>
          you agree to be bound by and pay all fees according to the terms of this<br>
          Agreement and the AH terms and conditions.<br>
          Certain AHs may allow you to pay for items using the online payment service powered by WePay, Inc.  ("WePay") and made available on the Sites (the "Payment Service").  Your use of the Payment Service is solely governed by WePay''s Terms of Service and Privacy Policy located at www.wepay.com/legal (collectively, the "WePay Terms").  You expressly acknowledge and agree that, if you elect to use the Payment Service, neither WePay nor Invaluable is a party to any contract between you and any AH.  All transactions, using the Payment Service or otherwise, remain subject to the applicable AH terms and conditions (including the refund policies posted therein).<br>
          <br>
          You may not use the Payment Service to engage in activities prohibited by the WePay Terms or otherwise to violate applicable law.  Either Invaluable or WePay may decline to process transactions that are too large in dollar amount, too long in duration or exceed other risk parameters.  In addition, WePay may decline to provide the Payment Service to you, or may impose a reserve requirement, or may limit transaction size, or may decline to process a transaction, based on WePay''s then-current compliance and risk management programs or any other bona fide reason. You will indemnify, hold harmless and defend Invaluable, WePay and their respective affiliates and each of their respective directors, officers, employees and agents from and against any and all claims, suits, actions, damages, demands, obligations, proceedings, investigations, liabilities or other losses of any kind (including reasonable attorneys' fees and costs) arising from a third party claim based on, arising from or relating to your use of the Payment Service.<br>
          <br><br>
          <br>
          2.4.01 Auction Houses. AHs will list items up for auction for you to bid on.<br>
          Auction dates and times, as well as the number, character, and order and<br>
          schedule of the items to be auctioned are set by the AH and are subject to<br>
          change without notice. Individual lots and items may be modified or changed at<br>
          any time. Some lots and items that are made available on the auction floor will<br>
          not be included in the online live auction services. We do not control the<br>
          information that is provided by AH's and which is made available through our system.<br>
          We do not guarantee that the AH's maintain proper auctioneer's licenses or<br>
          comply with all laws.<br>
          <br>
          <br>2.4.02 Based upon the<br>
          information provided by AH, Invaluable may categorize, tag or otherwise<br>
          describe property listed for auction on the Sites.&nbsp; Such categorizations,<br>
          "tags" and descriptions are provided for convenience only.&nbsp;<br>
          <span style="text-transform:uppercase;">Invaluable disclaims all representations and<br>
          warranties regarding the accuracy or reliability of such categorizations,<br>
          tags or descriptions of any nature, and by using the site, you hereby<br>
          acknowledge and agree that you shall have no recourse against Invaluable and its<br>
          affilaites and representatives arising out of or related to any such<br>
          categorizations, TAgs or descriptions.</span><br><br>
          <br>
          2.5 Bidding, Buying and Conditions of Sale. You may cancel an absentee bid on a<br>
          lot for a live auction up until the lot has been opened for live bidding. For<br>
          timed auctions the following cancelation rules will apply: <br><br>
          (<span class="SpellE">i</span>) Only three (3) bids may be canceled per session/<span<br>
          class=GramE&gt;catalog<br><br>
          (ii) No bid cancellations will be allowed within 2 hours of the scheduled first<br>
          lot end time.<br><br>
          If either of the two rules above has been exceeded (i.e. 3 timed bids have<br>
          already been cancelled for a single session/catalog or the timed auction is<br>
          within 2 hours), bidders may call Invaluable to request that their bid be<br>
          cancelled. These requests may only be made during office hours. Voicemail<br>
          requests for bid cancellation will not be considered.<br><br>
          <br>
          Invaluable reserves the right to take any adverse action, including without<br>
          limitation, termination of an account, against those who are deemed to be<br>
          abusing bid retraction and cancellations.<br><br>
          You expressly acknowledge and agree that Invaluable makes no guarantee or<br>
          representation regarding the effectiveness or success of bids. By placing a<br>
          bid, you expressly authorize Invaluable to begin bidding and continue bidding<br>
          on your behalf at any price in excess of the opening bid and up to the amount<br>
          of your<br><br>
          bid. You expressly acknowledge that Invaluable owes no duty to you to obtain<br>
          the <br><br>
          lowest possible price on behalf of you. The terms and conditions for<br>
          participation in each auction, <br><br>
          including how bids are accepted, rules governing absentee bids, bid increments,<br>
          bid retraction and cancellation, the conditions the buyer must meet to purchase<br>
          the item, as well as the specific conditions of sale (such as warranties,<br>
          shipping costs, insurance, and the like) may change for each auction by the AH.<br>
          The AH is required to post such terms and conditions and to maintain the terms<br>
          throughout the auction period. You agree to be bound by those bidding terms and<br>
          conditions of sale by agreeing to this Agreement. This Agreement, in addition<br>
          to those AH terms and conditions, govern your bidding activity as well as your<br>
          participation in an auction, except for timed auctions where the acceptance of<br>
          bids is determined solely by Invaluable's technology, the AH acts as an <br><br>
          auctioneer and has the final determination with respect to the bidding on the<br>
          item the sale of the item and the resolution of disputes, including the right<br>
          using its sole discretion to: a) determine who is the successful bidder; b)<br>
          reject any bid that it believes is not commensurate with the value of the item<br>
          being offered; and c) reject any bid that it believes may have a detrimental<br>
          effect on the item in question, or the auction as a whole. <br><br>
          <br>
          2.6 Video and Audio. Any audio or video aspects of a live auction event are for<br>
          entertainment purposes only.<br><br>
          <br>
          2.7 No warranty. WITHOUT LIMITING SECTION 10 BELOW, WE DO NOT WARRANT THAT THE<br>
          LIVE OR TIMED AUCTION SERVICE WILL BE UNINTERRUPTED OR ERROR FREE, OR THAT BIDS<br>
          WILL BE RECEIVED BY THE AH OR INFORMATION REGARDING CURRENT PRICE WILL BE<br>
          TRANSMITTED IN A TIMELY FASHION, NOR DO WE GUARANTEE THE PERFORMANCE OF ANY<br>
          OBLIGATIONS BY AN AH.<br><br>
          <br>
          2.8 Limitation of Liabilities. WITHOUT LIMITING SECTION 11 BELOW, IN NO EVENT<br>
          SHALL WE, AHs, OR OUR SUPPLIERS BE LIABLE FOR LOST PROFITS OR ANY SPECIAL,<br>
          INCIDENTAL OR CONSQUENTIAL DAMAGES ARISING OUT OF OR IN CONNECTION WITH THE<br>
          FAILURE OF ANY BID OR PRICING INFORMATION TO BE TRANSMITTED OR RECEIVED BY YOU<br>
          OR THE AH IN A TIMELY MANNER, THE INTERRUPTION OF ANY DATA TRANSMISSION, AUDIO<br>
          OR VIDEO BROADCAST, OR THIS AGREEMENT (HOWEVER ARISING, INCLUDING NEGLIGENCE).<br><br>
          <br>
          Section 3. Information You Provide to Us.<br><br>
          <br>
          3.1 Your Information. The term "Your Information" means collectively<br>
          the following: (<span class="SpellE">i</span>) any information or materials you<br>
          provide to us in connection with our registration process, your use of any<br>
          Services, or in email correspondence with us, (ii) any information or materials<br>
          you provide to other users of the Sites in connection with your use of any<br>
          Services, or in any public message board or chat room area, (iii) any<br>
          information or materials you provide to auction houses, appraisers, art or<br>
          antiques dealers, trade members, curators, educators, antiques professionals,<br>
          collectors or other third parties affiliated with Invaluable in connection with<br>
          your use of any Services, and (iv) any search terms or other instructions that<br>
          you transmit to our servers through a web browser. Please note that the<br>
          information and materials belonging to Your Information may include without<br>
          limitation textual information, graphic images, photographs, and audio-visual<br>
          materials. Except as may be otherwise expressly provided to the contrary in<br>
          this Agreement or the Additional Agreements, you are solely responsible for<br>
          Your Information, and we act at all times as a passive conduit for your online<br>
          distribution, communication, and/or publication of Your Information.<br><br>
          <br>
          3.2 Covenant Regarding Your Information. You agree that Your Information: (<span<br>
          class=SpellE&gt;i) will not be false, inaccurate, frivolous, or misleading,<br>
          (ii) will not infringe any third party's copyright, patent, trademark, trade<br>
          secret, or other proprietary rights or rights of publicity or privacy, (iii)<br>
          shall not violate any law, statute, ordinance, or regulation (including without<br>
          limitation those governing export control, consumer protection, unfair<br>
          competition, anti-discrimination, or false advertising), (iv) will not be<br>
          defamatory, trade libelous, unlawfully threatening , unlawfully harassing, or<br>
          obscene, (v) will not contain any computer viruses, worms, Trojan horses, time<br>
          bombs, or other computer programs, scripts, or instructions that are intended<br>
          to damage or detrimentally interfere with the operation or use of the Services,<br>
          or to intercept or expropriate any proprietary computer system information or<br>
          other confidential data or personal information relating to or arising out of<br>
          the access or use of the Services, (vi) will not create any liability for Invaluable<br>
          or cause Invaluable to lose (in whole or in part) the services of its internet<br>
          service providers or other suppliers and business affiliates, (vii) will not<br>
          contain any links to or from other information or websites for which you do not<br>
          have the right to make or reproduce such links, and (vii) will not solicit or<br>
          involve the purchase or sale of counterfeit, stolen or illegal items, or<br>
          solicit or commit any fraudulent transaction or other form of criminal<br>
          activity.<br><br>
          <br>
          3.3 Updated Information. If you are a registered user of the Sites, you agree<br>
          to promptly update your account registration information in order to keep it<br>
          current, complete, and accurate.<br><br>
          <br>
          3.4 Limited License. To enable us to use Your Information, so that we are not<br>
          violating any rights you might have in Your Information, you hereby grant us a<br>
          non-exclusive, worldwide, perpetual, irrevocable, royalty-free, sub-licensable<br>
          (through multiple tiers) right to exercise the copyright and publicity rights<br>
          (but no other rights) you have in Your Information, in any media now known or<br>
          hereafter existing, with respect to Your Information.<br><br>
          <br>
          3.5 Privacy Policy. We will only use Your Information in accordance with our<br>
          Privacy Policy, available at http://www.Invaluable.com/agreements/privacy.cfm.<br>
          By agreeing to the terms and conditions of this Agreement, you also give your<br>
          consent to the way we may use your Information pursuant to the Privacy Policy.<br>
          If you have any questions not addressed in our Privacy Policy Document, you<br>
          should address them to support@Invaluable.com. Any information you provide to<br>
          an AH or other third parties is governed by their respective privacy policies. <br><br>
          <br>
          Section 4. Use of Content.<br><br>
          <br>
          4.1 Copyright. You acknowledge that the Services contain information, text,<br>
          software, photographs, music, audio and video clips, graphics, links and other<br>
          material (collectively, the "Content") that are protected by<br>
          copyright, trademark or other proprietary rights of Invaluable or third<br>
          parties. All Content used or made available through the Services is copyrighted<br>
          as a collective work and/or compilation of Invaluable pursuant to applicable<br>
          copyright law. Invaluable owns a copyright in the selection, coordination,<br>
          arrangement and enhancement of such Content, as well as in the content original<br>
          to Invaluable. You agree to comply with any additional copyright notices,<br>
          information, or restrictions contained in any Content available on or accessed<br>
          through the Services. Invaluable does not grant permission to users of its<br>
          Services to reproduce images of original works of art.<br><br>
          <br>
          4.2 Limited License. Subject to your compliance with the terms and conditions<br>
          of this Agreement (including without limitation the restrictive terms and<br>
          conditions set forth in this Section 4), and except to the extent otherwise<br>
          expressly provided in an Additional Agreement between you and Invaluable, you<br>
          are granted a limited non-exclusive, non-transferable, non-sub-licensable, and<br>
          revocable license to access the Services and/or Content only for your own<br>
          personal non-commercial use.<br><br>
          <br>
          You acknowledge that all Content included with the Services is provided for<br>
          your own use. In no case shall you re-publish the Content in any form without<br>
          express written permission of Invaluable. You will limit printouts for personal<br>
          use of the material to a maximum of 35 individual text listings per individual.<br>
          Reproduction of images is strictly prohibited without the written permission of<br>
          both Invaluable and the originating auction house. Your right to use this<br>
          product is limited to a single workstation unless an additional agreement for<br>
          network access has been signed by both parties. You acknowledge that you are<br>
          not permitted to sell or otherwise dispose the software and that no rights<br>
          granted hereunder may be assigned or sublicensed by Licensee, any assignment or<br>
          sublicense being void.<br><br>
          <br>
          You agree to maintain and/or reproduce all copyright and other notices<br>
          contained in such Services and/or Content. You may not modify, publish,<br>
          transmit, transfer or sell, resell, reproduce, create derivative works from,<br>
          distribute, perform, display, or in any way exploit or commercially use any of<br>
          the Services and/or Content, in whole or in part, except as expressly permitted<br>
          in this Agreement or in an Additional Agreement between you and Invaluable. You<br>
          acknowledge that you do not acquire any ownership rights by accessing or<br>
          downloading copyrighted materials. You shall not store electronically any<br>
          portion of any Services and/or Content. You may not collect and use e-mail<br>
          addresses of other users of the Sites or other user account information,<br>
          listings, or perform any form of data extraction or data-mining whatsoever.<br>
          Except as expressly permitted by the copyright laws, no copying, storage,<br>
          redistribution or publication of any of the Services and/or Content is permitted<br>
          without the express permission of Invaluable or the owners of such Services<br>
          and/or Content or their authorized persons, if other than Invaluable. You are<br>
          responsible for complying with all applicable laws, rules, and regulations<br>
          regarding your use of any such downloaded Content. Invaluable reserves all<br>
          rights in the Content and Services not expressly granted hereunder.<br><br>
          <br>
          4.3 Trademarks. Invaluable is a trademark of Invaluable, LLC.  All rights reserved.  All other trademarks associated with product and company names that may appear in connection with the posting of items for sale are the property of their respective owners.  Use of such third party trademarks does not suggest or imply any affiliation with or endorsement by those third parties.<br><br>
          <br>
          4.4 Uploading or Posting Content. You will not upload, post, or otherwise make<br>
          available through the Services any Content protected by copyright, trademark,<br>
          or other proprietary right without the express permission of the owner of the<br>
          copyright, trademark, or other proprietary right and the burden of determining<br>
          that any material is not protected by copyright rests with you. You shall be<br>
          solely liable for any damage resulting from any infringement of copyrights,<br>
          proprietary rights, or any other harm resulting from such a submission. By<br>
          submitting Content to any public area of the Sites, you hereby grant, or warrant<br>
          that the owner of such Content has expressly granted, Invaluable a<br>
          royalty-free, perpetual, irrevocable, non-exclusive right and license to use,<br>
          reproduce, modify, adapt, publish, translate, publicly display and distribute<br>
          such Content (in whole or in part) worldwide and/or to incorporate it in other<br>
          works in any form, media or technology now known or hereafter developed for the<br>
          full term of any copyright that may exist in such Content. You also permit any<br>
          other user of the Services to access, view, store, or reproduce such Content<br>
          for that user's personal use.<br><br>
          <br>
          4.5 Beneficiaries. The foregoing provisions of this Section 3 are for the<br>
          benefit of Invaluable, its subsidiaries, affiliates and its third party content<br>
          providers and licensors and each shall have the right to assert and enforce<br>
          such provisions directly or on its own behalf.<br><br>
          <br>
          Section 5. Sites Access; Interference with Services; Monitoring; Compliance<br>
          with Laws.<br><br>
          <br>
          5.1 Sites Access. We do not guarantee continuous, uninterrupted, or secure<br>
          access to the Services, and operation of the Sites may be interfered with by<br>
          numerous factors outside of our control. We recommend that you use Invaluable<br>
          with Microsoft Windows Operating Systems and Internet Explorer Version 5.5 or<br>
          later. Internet connection speed will determine how rapidly pages with<br>
          photographs load to your browser. <br><br>
          <br>
          5.2 No Interference. You agree that you will not use any robot, spider, other<br>
          automatic device, or manual process to monitor or copy our web pages or the content<br>
          contained herein without our prior expressed written permission. You agree that<br>
          you will not use any device, software, or routine to interfere or attempt to<br>
          interfere with the proper working of the Sites or the Services, or any<br>
          transaction being conducted on or through the Sites or Services. You agree that<br>
          you will not take any action that imposes an unreasonable or disproportionately<br>
          large load on the server infrastructure of the Sites.<br><br>
          <br>
          5.3 Fraudulent Activity. You may not register to use any Services under a false<br>
          name, or use an invalid or unauthorized credit card in connection with any<br>
          Services. You may not make offers to purchase any goods or services under a<br>
          false name while using the Services. You may not impersonate any other user of<br>
          the Services, or make use of another user's password(s). Such fraudulent<br>
          conduct is a violation of federal and state laws. Fraudulent conduct may be<br>
          reported by us to law enforcement authorities, and we will cooperate with such<br>
          authorities to ensure that violators are prosecuted to the fullest extent of<br>
          the law.<br><br>
          <br>
          5.4 Monitoring. You agree that Invaluable has the right, but not the<br>
          obligation, to monitor any form of user activity and/or Content linked to or<br>
          from or otherwise associated with the Services. We may investigate any reported<br>
          violation of our Agreement, Additional Agreements or Sites policies, and any<br>
          user or other third party complaints relating thereto. We may take any action<br>
          that we deem appropriate in connection with any such investigation without notice<br>
          (including without limitation issuing warnings, suspending or terminating<br>
          Services, denying Sites access and/or removing any materials posted on the<br>
          Sites). We may also investigate, in our sole discretion, the use of any credit<br>
          card by a user in connection with the Services, and take such action as we deem<br>
          necessary or appropriate, including without limitation contacting the owner or<br>
          user of such card or canceling purchase orders placed by such owner or user.<br><br>
          <br>
          5.5 Compliance with Laws. The Services may be used only for lawful purposes and<br>
          in a lawful manner. You agree to comply with all applicable laws, statutes and<br>
          regulations regarding use of the Services and any transactions that may be<br>
          conducted by means of the Services.<br><br>
          <br>
          Section 6. External Sites; Linking.<br><br>
          <br>
          6.1 External Sites. The Services may contain links to websites on the Internet<br>
          that are owned and operated by third parties (the "External Sites").<br>
          This Agreement does not apply to your use of any External Sites to which the<br>
          Sites links, and we are not responsible for the availability of any External<br>
          Sites to which the Sites links. We do not endorse or take responsibility for<br>
          the contents, advertising, products or other materials made available through<br>
          any External Sites, and you acknowledge that Invaluable is not responsible for<br>
          the availability of, or the content, advertising, products, or other materials<br>
          located on or through, any External Sites. Under no circumstances will we be<br>
          held responsible or liable, directly or indirectly, for any loss or damage that<br>
          is caused or alleged to have been caused to you in connection with your use of,<br>
          or reliance on, any content, goods, or services available on any External<br>
          Sites. If you decide to access an External Sites, you do so at your own risk. You<br>
          should contact the sites administrator or Webmaster for those External Sites if<br>
          you have any concerns regarding such links or the content or services located<br>
          on such External Sites.<br><br>
          <br>
          Section 7. Breach.<br><br>
          <br>
          7.1 Without limiting other remedies, we may immediately issue a warning,<br>
          temporarily suspend, indefinitely suspend or terminate your registered user<br>
          account and/or refuse to provide the Services to you: (<span class="SpellE">i</span>)<br>
          if you breach this Agreement or any of the Additional Agreements it<br>
          incorporates by reference or which you have separately entered into with Invaluable;<br>
          (ii) if we are unable to verify or authenticate any information you provide to<br>
          us; or (iii) if we believe that your actions may cause legal liability for you,<br>
          us, our other users, or other third party business affiliates.<br><br>
          <br>
          Section 8. Indemnity.<br><br>
          <br>
          8.1 You agree to indemnify, defend, and hold Invaluable and its affiliates, and<br>
          their respective officers, directors, owners, agents, information providers,<br>
          and licensors (collectively, the "Company Parties") harmless from and<br>
          against any and all claims, liability, losses, costs, and expenses (including<br>
          attorneys' fees) incurred by any Company Party in connection with any use or<br>
          alleged use of the Service under your password by any person, whether or not<br>
          authorized by you. Invaluable reserves the right, at its own expense, to assume<br>
          the exclusive defense and control of any matter otherwise subject to<br>
          indemnification by you, and in such case, you agree to cooperate with <span<br>
          class=SpellE&gt;Invaluable's defense of such claim.<br><br>
          <br>
          Section 9. Termination of or Change in the Services.<br><br>
          <br>
          9.1 Invaluable shall not be liable to you or to any third party for any of the<br>
          direct or indirect consequences of any modification, malfunction, suspension,<br>
          discontinuance of or interruption to or of any of the Services. Invaluable<br>
          reserves the right, in its sole discretion, to restrict, suspend, or terminate<br>
          your access to all or any part of the Services at any time for any reason<br>
          without prior notice or liability. Invaluable may change, suspend or<br>
          discontinue all or any aspect of the Services at any time, including the<br>
          availability of any feature, database, or Content without prior notice or<br>
          liability.<br><br>
          <br>
          SECTION 10. DISCLAIMER OF WARRANTIES.<br><br>
          <br>
          10.1 NEITHER INVALUABLE NOR ANY PROVIDER OF THIRD PARTY CONTENT OR THEIR<br>
          RESPECTIVE AGENTS WARRANTS THAT THE SITES OR SERVICE WILL MEET YOUR<br>
          REQUIREMENTS OR BE UNINTERRUPTED, TIMELY, SECURE OR ERROR FREE; NOR DOES INVALUABLE,<br>
          ANY THIRD PARTY CONTENT PROVIDER, OR THEIR RESPECTIVE AGENTS MAKE ANY WARRANTY<br>
          AS TO THE RESULTS TO BE OBTAINED FROM USE OF THE SITES, SERVICES OR THE<br>
          CONTENT. THE SERVICES AND THE CONTENT ARE DISTRIBUTED ON AN "AS IS, AS<br>
          AVAILABLE" BASIS. NONE OF INVALUABLE, THIRD-PARTY CONTENT PROVIDERS, AND<br>
          THEIR RESPECTIVE AGENTS MAKE ANY WARRANTIES OF ANY KIND, EITHER EXPRESS,<br>
          IMPLIED OR STATUTORY, INCLUDING, WITHOUT LIMITATION, WARRANTIES OF TITLE OR<br>
          IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE OR<br>
          NON-INFRINGEMENT, WITH RESPECT TO THE SITES, SERVICES, ANY CONTENT OR ANY<br>
          PRODUCTS OR SERVICES SOLD THROUGH THE SERVICES. NEITHER INVALUABLE NOR ANY<br>
          THIRD PARTY CONTENT PROVIDER WARRANTS THAT ANY FILES AVAILABLE FOR DOWNLOADING<br>
          THROUGH THE SITES OR SERVICES WILL BE FREE OF VIRUSES OR SIMILAR CONTAMINATION<br>
          OR DESTRUCTIVE FEATURES. YOU EXPRESSLY AGREE THAT THE ENTIRE RISK AS TO THE<br>
          QUALITY AND PERFORMANCE OF THE SERVICES AND THE ACCURACY OR COMPLETENESS OF THE<br>
          CONTENT IS ASSUMED SOLELY BY YOU. WITHOUT LIMITING ANY PROVISION HEREIN, INVALUABLE<br>
          MAKES NO WARRRANY THAT ANY PARTICULAR COMPUTER SYSTEM CONFIGURATION WILL BE<br>
          COMPATIBLE WITH THE SITES. IT IS YOUR SOLE RESPONSIBILITY TO ENSURE THAT YOUR<br>
          COMPUTER SYSTEM HAS THE RECOMMENDED HARDWARE, OPERATING SOFTWARE, AND INTERNET<br>
          BROWSER SOFTWARE VERSIONS TO ACHIEVE THE SITES FULL FUNCTIONALITY AND<br>
          CAPABILITIES. Some states do not allow the disclaimer of implied warranties or<br>
          limitation on how long an implied warranty lasts, so the above disclaimer or<br>
          limitation may not apply to you. You may have other rights, which vary from<br>
          state to state.<br><br>
          <br>
          10.2 The Sites includes an extensive collection of auction records that might<br>
          be used as tools in the process of estimating values. Invaluable Content is<br>
          only one of several elements that you should consider in estimating value of an<br>
          antique or other artistic work and depends upon the accuracy and timing of<br>
          information which Invaluable itself receives. Invaluable strongly recommends<br>
          that its Content only be used in conjunction with other specialists such as<br>
          Auction Houses, Personal Property Appraisers, Museums, and Dealers.<br><br>
          While Invaluable will endeavor to use commercially reasonable efforts to confirm the authenticity of the goods it receives and posts for auction via its websites, Invaluable makes no claims, representations or warranties with regard to the authenticity of any goods sold on its websites.  Accordingly, to the extent permitted by applicable law, we exclude all express or implied warranties, terms and conditions including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, and non-infringement.  In addition, to the extent permitted by applicable law, Invaluable (including our affiliates, officers, directors, agents and employees) is not liable, and you agree not to hold Invaluable responsible, for any damages or losses (including, but not limited to, loss of money, goodwill or reputation, profits, or other intangible losses or any special, indirect, or consequential damages) resulting directly or indirectly from the items posted for sale on our websites.  Some jurisdictions do not allow the disclaimer of warranties or exclusion of damages, so such disclaimers and exclusions may not apply to you.  If you have purchased an item that is not as described in our posting for auction, your sole remedy is to return it in the condition you received it in exchange for a refund.<br><br>
          If you believe that an item posted for sale on our websites violates a trademark, copyright or other intellectual property right held by you, please notify us immediately regarding the posting in question and the basis for your claim so we can properly investigate your claim.<br><br>
          <br>
          10.3 Invaluable and third party content providers are not responsible for the<br>
          translations provided by Google Translate. The translated copies of the Sites<br>
          are not legally binding, and any differences created in translation have no<br>
          legal effect. Please be aware that the original lot description in the auction<br>
          catalogue provided by the AH is the official Content. If there are any concerns<br>
          regarding the accuracy of the information presented within the translated<br>
          versions of our sites, please refer back to the official Content.<br><br>
          <br>
          SECTION 11. LIMITATION OF LIABILITY.<br><br>
          <br>
          11.1 THE LIMITATION OF LIABILITY CONTAINED IN THIS SECTION 10 APPLY TO ANY<br>
          DAMAGES OR INJURY CAUSED BY ANY FAILURE OF PERFORMANCE, ERROR, OMISSION,<br>
          INTERRUPTION, DELETION, DEFECT, DELAY IN OPERATION OR TRANSMISSION, COMPUTER<br>
          VIRUS, COMMUNICATION LINE FAILURE, THEFT OR DESTRUCTION OR UNAUTHORIZED ACCESS<br>
          TO, ALTERATION OF, OR USE OF RECORD, WHETHER FOR BREACH OF CONTRACT, TORTIOUS<br>
          BEHAVIOR, NEGLIGENCE, OR UNDER ANY OTHER CAUSE OF ACTION. YOU SPECIFICALLY<br>
          ACKNOWLEDGE THAT INVALUABLE IS NOT LIABLE FOR THE DEFAMATORY, OFFENSIVE OR<br>
          ILLEGAL CONDUCT OF OTHER USERS OR THIRD PARTIES AND THAT THE RISK OF INJURY<br>
          FROM THE FOREGOING RESTS ENTIRELY WITH YOU.<br><br>
          <br>
          11.2 UNDER NO CIRCUMSTANCES WILL INVALUABLE OR ITS AFFILIATES, OR ANY OF ITS<br>
          SHAREHOLDERS, OFFICERS, DIRECTORS, EMPLOYEES OR AGENTS BE LIABLE FOR ANY LOSS<br>
          OR DAMAGE CAUSED BY YOUR RELIANCE ON INFORMATION OBTAINED THROUGH EITHER THE<br>
          CONTENT OR THE SERVICES, OR ANY LOSS OR DAMAGE CAUSED BY YOU BEING EXPOSED TO<br>
          INFORMATION CONTAINED ON THE SITES. IT IS YOUR RESPONSIBILITY TO EVALUATE THE<br>
          ACCURACY, COMPLETENESS OR USEFULNESS OF ANY INFORMATION, OPINION, ADVICE OR<br>
          OTHER CONTENT AVAILABLE THROUGH THE SERVICE. PLEASE SEEK THE ADVICE OF<br>
          PROFESSIONALS, AS APPROPRIATE, REGARDING THE EVALUATION OF ANY SPECIFIC<br>
          INFORMATION, OPINION, ADVICE OR OTHER CONTENT, INCLUDING OPINIONS OR ADVICE<br>
          REGARDING THE IDENTIFICATION, VALUATION OR CARE OF ANTIQUES.<br><br>
          <br>
          11.3 NEITHER INVALUABLE, ANY THIRD-PARTY CONTENT PROVIDER NOR THEIR RESPECTIVE<br>
          AGENTS SHALL BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL OR<br>
          CONSEQUENTIAL DAMAGES ARISING OUT OF THE USE OF OR INABILITY TO ACCESS OR USE<br>
          THE SITES OR SERVICES, EVEN IF SUCH PARTY HAS BEEN ADVISED OF THE POSSIBILITY<br>
          OF SUCH DAMAGES. OUR LIABILITY, AND THE LIABILITY OF OUR SUPPLIERS, TO YOU OR<br>
          ANY THIRD PARTIES IN ANY CIRCUMSTANCE IS LIMITED TO THE GREATER OF (A) THE<br>
          AMOUNT OF FEES YOU PAY TO US IN THE 12 MONTHS PRIOR TO THE ACTION GIVING RISE<br>
          TO LIABILITY, AND (B) $100.00. Some states do not allow exclusion of implied<br>
          warranties or limitation of liability for incidental or consequential damages,<br>
          so the above limitations or exclusions may not apply to you. In such states,<br>
          the liability of Invaluable, third party content providers and their respective<br>
          agents shall be limited to the greatest extent permitted by law. Some states do<br>
          not allow the limitation of liability, so the foregoing limitation may not<br>
          apply to you.<br><br>
          <br>
          SECTION 12. MICELLANEOUS<br><br>
          <br>
          12.1 Copyright Infringement Policy. Invaluable observes the rights of all<br>
          copyright holders and has adopted and implemented a policy that provides for<br>
          the termination in appropriate circumstances of users and registered account<br>
          holders who infringe the rights of copyright holders. If you believe that your<br>
          work or that of a third party has been copied in a way that constitutes<br>
          copyright infringement, please provide our Copyright Officer (who may be<br>
          contacted electronically at support@Invaluable.com or care of our notice<br>
          address in Section 12.7 below) with the information required below by the<br>
          Online Copyright Infringement Liability Limitation Act of the Digital<br>
          Millennium Copyright Act, 17 U.S.C. 512:<br><br>
          <br>
          A. A physical or electronic signature of a person authorized to act on behalf<br>
          of the owner of an exclusive right that is allegedly infringed;<br><br>
          <br>
          B. Identification of the copyright work claimed to have been infringed, or, if<br>
          multiple copyrighted works at a single online sites are covered by a single<br>
          notification, a representative list of such works at that sites;<br><br>
          <br>
          C. Identification of the material that is claimed to be infringing or to be the<br>
          subject of infringing activity and that is to be removed or access to which is<br>
          to be disabled, and information reasonably sufficient to permit us to locate<br>
          the material;<br><br>
          <br>
          D. Information reasonably sufficient to permit us to contact the complaining<br>
          party;<br><br>
          <br>
          E. A statement that the complaining party has a good-faith belief that use of<br>
          the material in the manner complained of is not authorized by the copyright<br>
          owner, its agent, or the law; and<br><br>
          <br><br>
          F. A statement that the information in the notification is accurate, and under<br>
          penalty of perjury, that the complaining party is authorized to act on behalf<br>
          of the owner of an exclusive right that is allegedly infringed.<br><br>
          <br>
          12.2 Governing Law. ALL DISPUTES, CLAIMS OR CONTROVERSIES ARISING OUT OF THIS<br>
          AGREEMENT, OR THE NEGOTIATION, VALIDITY OR PERFORMANCE OF THIS AGREEMENT, OR<br>
          THE TRANSACTIONS CONTEMPLATED HEREBY SHALL BE GOVERNED BY AND CONSTRUED IN<br>
          ACCORDANCE WITH THE LAWS OF THE COMMONWEALTH OF MASSACHUSETTS WITHOUT REGARD TO<br>
          ITS RULES OF CONFLICT OF LAWS. Each of the parties hereto hereby irrevocably<br>
          and unconditionally consents to submit to the sole and exclusive jurisdiction<br>
          of the courts of the Commonwealth of Massachusetts and of the United States of<br>
          America located in the Commonwealth of Massachusetts (the "Massachusetts<br>
          Courts") for any litigation among the parties hereto arising out of or<br>
          relating to this Agreement, or the negotiation, validity or performance of this<br>
          Agreement, waives any objection to the laying of venue of any such litigation<br>
          in the Massachusetts Courts and agrees not to plead or claim in any<br>
          Massachusetts Court that such litigation brought therein has been brought in<br>
          any inconvenient forum or that there are indispensable parties to such<br>
          litigation that are not subject to the jurisdiction of the Massachusetts<br>
          Courts.<br><br>
          <br>
          12.3 Headings. Section headings in this Agreement are for reference purposes<br>
          only and in no way define, limit, construe or describe the scope or extent of<br>
          such section.<br><br>
          <br>
          12.4 Severability; Construction. If any provision of this Agreement is held to<br>
          be invalid or unenforceable, such provision shall be struck and the remaining<br>
          provisions shall be enforced. If any inconsistency exists between the terms of<br>
          this Agreement and any additional terms and conditions of Additional Agreements<br>
          (whether such Additional Agreements are posted in electronic format on the<br>
          Sites or are separate written agreements entered into between you and Invaluable)<br>
          such terms shall be interpreted as to eliminate any inconsistency, if possible,<br>
          and otherwise, the additional terms and conditions of the Additional Agreements<br>
          shall control.<br><br>
          <br>
          12.5 Waiver. <span class="SpellE">Invaluable's</span> failure to exercise or<br>
          forbearance from exercising any rights or remedies, or failure to enforce or<br>
          forbearance from enforcing, the strict performance of any provision of this<br>
          Agreement, will not constitute a waiver of <span class="SpellE">Invaluable's</span><br>
          right to exercise such rights or remedies or enforce such provision or any<br>
          other provisions of this Agreement in that or any other instance. Any waiver of<br>
          any provision of this Agreement by Invaluable must be made in writing and<br>
          signed by an authorized representative of Invaluable specifically referencing<br>
          this Agreement and the provision to be waived.<br><br>
          <br>
          12.6 Assignment; Third-Party Beneficiaries. This Agreement will inure to the<br>
          benefit of <span class="SpellE">Invaluable's</span> successors and assigns.<br>
          Except as set forth in this Agreement, this Agreement shall not benefit or<br>
          create any right or cause of action in or on behalf of any person other than<br>
          the parties hereto.<br><br>
          <br>
          12.7 Notices. Except as otherwise provided herein, any notices to be given<br>
          pursuant to this Agreement may be given by postal mail to Invaluable, LLC 38<br>
          Everett Street, Suite 101, Boston, MA 02134, Attn: Vice President of Operations<br>
          (in the case of us) or to the email address you provide to Invaluable during<br>
          the registration process (in your case). Notice shall be deemed given 24 hours<br>
          after email is sent, unless the sending party is notified that the email<br>
          address is invalid. Alternatively, we may give you notice by certified mail,<br>
          postage prepaid and return receipt requested, to the address provided to Invaluable<br>
          during the registration process in the event that an address was supplied. In<br>
          such case, notice shall be deemed given 3 days after the date of mailing.<br><br>
          <br>
          12.8 Survival. Subsections 1.8, 3.1, 3.3, 3.4, 3.5, 3.6, 4.3, 4.4 and 5.1 and<br>
          Section 7, 8, 9, 10 and 11, shall survive any termination of this Agreement as<br>
          well as any other provisions which by their terms or sense are intended to<br>
          survive. <br><br>
          <br>
          12.9 Integration. This Agreement constitutes the entire agreement between the<br>
          parties with respect to the subject matter hereof, and except for any<br>
          Additional Agreements that you may have entered into with Invaluable,<br>
          supersedes all previous written or oral agreements between the parties with<br>
          respect to such subject matter hereof.<br>
          <br>
          </span<br></span<br></span<br></div><br>
          <br>
          <br>
          <br>
          <br>


        </td>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="ruleDialogVisible = false" class="meebidLoginDialogButton">OK</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import $ from 'jquery'
import loginUtils from './../../utils/loginUtils'
import validationUtils from './../../utils/validationUtils'
import errorUtils from './../../utils/errorUtils'
export default {
  data () {
    var validateEmail = (rule, value, callback) => {
      var regex = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;

      if (!value.match(regex)){
        callback(new Error('Please input correct email.'));
      } else {
        $.ajax({  
          url : "/api/user/email/check?email=" + value,  
          type : 'GET',  
          context: this,
          contentType : "application/json", 
          dataType : 'json',
          success : function(data) {
            if (data.code == '1'){
              callback();
            } else {  
              callback(new Error(data.msg));
            }
          },  
          error : function(data) {  
            errorUtils.requestError(data);  
            callback(new Error("Error"));
          }
        })  
      }
      
    }
    var validatePassword = (rule, value, callback) => {
      if (this.form.password !== '' && this.form.confirmPassword !== '') {
        this.$refs.form.validateField('confirmPassword');
      }
      callback();
    };
    var validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.form.password) {
        callback(new Error('Password does not match.'));
      } else {
        callback();
      }
    };
    return {
      ruleDialogVisible: false,
      active: 0,
      loginForm: {
        email: "",
        password: ""
      },
      loginFormRules: {
        email: [
          { required: true, message: 'Please input email', trigger: 'blur' }          
        ],
        password: [
          { required: true, message: 'Please input password', trigger: 'blur' }    
        ],
      },
      form: {
        type: "member",
        email: "",
        password: "",
        confirmPassword: ""
      },
      formRules: {
        email: [
          { required: true, message: 'Please input email', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur'}      
        ],
        password: [
          { required: true, message: 'Please input password.', trigger: 'blur' },
          { min: 6, max: 255, message: 'Password cannot be less than 6 characters', trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: 'Please input password again.', trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    var me = this;
    console.log("Register Page Ready");
    setTimeout(function(){
      me.loginForm = {
        email: "",
        password: ""
      };
      me.form = {
        type: "member",
        email: "",
        password: "",
        confirmPassword: ""
      };
      me.$refs.loginForm.resetFields();
      me.$refs.form.resetFields();
    }, 200);
  },

  methods: {
    redirectToHome() {
      window.location.href = "./home.html";
    },
    onLogin() {
      $.ajax({  
        url : "/api/user/login",  
        type : 'POST',  
        data : JSON.stringify({  
          email : this.loginForm.email,  
          password : this.loginForm.password  
        }),
        context: this,
        contentType : "application/json", 
        success : function(data) {
          if (data.code == '1'){
            let currentDate = new Date()
            currentDate.setTime(currentDate.getTime() + data.content.expiredAt * 1000)
            loginUtils.setLoginUser({
              expireTime: currentDate.getTime(),
              token: data.content.token
            })
            this.$refs.loginFormRef.resetFields()
          } else {  
            this.$notify({
              title: 'Failure',
              message: 'Login failed',
              duration: 5000
            })
          }        
          window.location.href = "./home.html"
        },  
        error : function(data) {  
          alert(data);  
        }
      })  
    },
    onSubmit() {
      var me = this;
      this.$refs.form.validate((valid) => {
        if (valid) {
          $.ajax({
            type: "POST",
            url: "/api/user/register",
            contentType : "application/json", 
            context: this,
            data: JSON.stringify({
              email: this.form.email,
              password: this.form.password,
              type: this.form.type
            }),
            success() {
              this.$notify({
                title: 'Success',
                duration: 0,
                message: 'Register successful. Please check your email to activate your accout.',
                showClose: true,
                type: "success"
              })
            },
            error() {
              this.$notify.error({
                title: 'Failure',
                message: 'Register failure',
                duration: 5000
              })
            }
          }).done(function(){
            console.log("register done");
          });
        } else {
          return false;
        }
      });

    },
    showTermConditionDialog() {
      this.ruleDialogVisible = true;
    }
  }
}
</script>

<style>
html
{
  height:100%;
  margin:0;
}
body
{
  height:100%;
  margin:0; 
}
#app {
  height: 100%;
}
</style>
