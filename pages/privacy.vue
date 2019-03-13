<template>
  <v-container
    fluid
    fill-height
    :class="$device.isDesktop ? 'grid-list-lg' : 'pa-0'"
  >
    <v-layout align-center justify-center text-xs-center>
      <v-flex xs12 sm12 md8 lg6 xl6>
        <v-subheader>Updated: 04.08.2018</v-subheader>
        <v-card class="subheading" color="transparent" flat>
          <v-toolbar
            card
            color="transparent"
          >
            <v-spacer/>
            <h1 class="display-1">{{$tc("privacy.headline", 1)}}</h1>
            <v-spacer/>
          </v-toolbar>
          <v-card-text>
            <p class="text-xs-left">
              In this Privacy Policy, “Service”, “we” or “us” means MyOngoingsCalendar.eu. Your privacy is important to
              us.
            </p>
            <p class="text-xs-left">
              This privacy policy is applicable only to the Service and does not extend to information collected
              by any other websites or to the practices or procedures of companies that the Service does not
              control. Note that the Service may contain links to other websites, linking to another website. In
              such cases, this Privacy Policy does not apply to information collected on that website. We are not
              responsible for the privacy practices of other websites, and we recommend that you read the privacy
              policies of each website that you visit.
            </p>
            <p class="text-xs-left">
              You do not need to provide information directly to us in order to use the Service. However, when you
              using certain functions on the Service, such as accessing certain features or content, registering
              for certain services, or contacting the Service directly, we may ask for the information, which include
              email address, nickname, password and information posted in comments.
            </p>
            <p class="text-xs-left">
              We may access information about you from third-party sources and platforms (such as Google Analytics).
            </p>
            <p class="text-xs-left">
              By using this Service, you consent to the uses stated above and any other use of information
              identified in this privacy policy. In addition, we may use the information that we collect for any
              other purposes disclosed to you at the time we collect your information or pursuant to your consent.
            </p>
            <p class="text-xs-left">
              We values your privacy and do not provide confidential information to third parties.
            </p>
            <p class="text-xs-left">
              We use a cookie called 'vuex', which is necessary for the functioning of the application (also, some cookies from Cloudflare and Google which are not controlled by us).
            </p>
            <p class="text-xs-left">
              We does not collect or solicit personal information from anyone under the age of 16 or knowingly
              allow such persons to register. In the event that we learn that we have collected personal
              information from a child under age 16 without verification of parental consent, we will delete such
              information The Service is designed to be of service and interest to users ages 16 and older. If you
              are a minor over the age of 16, you may only use this Service with the permission and under the
              supervision of your parent or guardian. If you are a minor under the age of 16, please do not send
              any information about yourself to us, including email address.
            </p>
            <p class="text-xs-left">
              We limit access to contact information about you to service providers who we believe reasonably need
              to come into contact with that information to provide products or services to you or in order to do
              their jobs. We also have adopted technical and administrative procedures to help protect information
              about you from loss, misuse, and alteration.
              Please note that no data transmission or storage can be guaranteed to be 100% secure. We want you to
              feel confident using the Service, but we cannot ensure or warrant the security of any information you
              transmit to us.
            </p>
            <p class="text-xs-left">
              Please check this page periodically for changes as we reserve the right to change this Privacy
              Policy at any time. Your continued use of our Service following the posting of changes to these
              terms will constitute acceptance of those changes. Information collected prior to the time any
              change is posted will be used according to the rules that applied at the time the information was
              collected.
            </p>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data: () => ({}),
    head() {
      return {
        title: this.$t("meta_info.privacy.title", ['| MyOngoingsCalendar']),
        meta: [
          {
            name: 'description',
            content: this.$t("meta_info.privacy.meta.description", ['MyOngoingsCalendar'])
          }
        ]
      }
    }
  }
</script>
