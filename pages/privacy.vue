<template>
  <v-container fill-height>
    <v-row justify="center">
      <v-col xs="12" md="10" lg="6">
        <v-subheader>Updated: 26.03.2021</v-subheader>
        <h1 class="text-center">{{ $tc('privacy.headline', 1) }}</h1>
        <v-card class="subheading" color="transparent" flat>
          <v-card-text class="text-left text-justify">
            <p>
              In this Privacy Policy, “Service”, “we” or “us” means {{ baseUrl }}. Your privacy is important to
              us.
            </p>
            <p>
              This privacy policy is applicable only to the Service and does not extend to information collected
              by any other websites or to the practices or procedures of companies that the Service does not
              control. Note that the Service may contain links to other websites, linking to another website. In
              such cases, this Privacy Policy does not apply to information collected on that website. We are not
              responsible for the privacy practices of other websites, and we recommend that you read the privacy
              policies of each website that you visit.
            </p>
            <p>
              You do not need to provide information directly to us in order to use the Service. However, when you
              using certain functions on the Service, such as accessing certain features or content, registering
              for certain services, or contacting the Service directly, we may ask for the information, which include
              email address, nickname, password and information posted in comments.
            </p>
            <p>
              By using this Service, you consent to the uses stated above and any other use of information
              identified in this privacy policy. In addition, we may use the information that we collect for any
              other purposes disclosed to you at the time we collect your information or pursuant to your consent.
            </p>
            <p>
              We values your privacy and do not provide confidential information to third parties.
            </p>
            <p>
              We use a cookie called 'vuex', which is necessary for the functioning of the application (also, some
              cookies from Cloudflare which are not controlled by us).
            </p>
            <p>
              This Service can use GTM(Google Analytics) to ensure you get the best experience on our service. You can
              always turn on/off this in the settings.
            </p>
            <p>
              We does not collect or solicit personal information from anyone under the age of 16 or knowingly
              allow such persons to register. In the event that we learn that we have collected personal
              information from a child under age 16 without verification of parental consent, we will delete such
              information The Service is designed to be of service and interest to users ages 16 and older. If you
              are a minor over the age of 16, you may only use this Service with the permission and under the
              supervision of your parent or guardian. If you are a minor under the age of 16, please do not send
              any information about yourself to us, including email address.
            </p>
            <p>
              We limit access to contact information about you to service providers who we believe reasonably need
              to come into contact with that information to provide products or services to you or in order to do
              their jobs. We also have adopted technical and administrative procedures to help protect information
              about you from loss, misuse, and alteration.
              Please note that no data transmission or storage can be guaranteed to be 100% secure. We want you to
              feel confident using the Service, but we cannot ensure or warrant the security of any information you
              transmit to us.
            </p>
            <p>
              Please check this page periodically for changes as we reserve the right to change this Privacy
              Policy at any time. Your continued use of our Service following the posting of changes to these
              terms will constitute acceptance of those changes. Information collected prior to the time any
              change is posted will be used according to the rules that applied at the time the information was
              collected.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  head() {
    return {
      title: this.$t('meta_info.privacy.title', ['| MyOngoingsCalendar']),
      meta: [
        {
          name: 'description',
          content: this.$t('meta_info.privacy.meta.description', ['MyOngoingsCalendar'])
        }
      ]
    };
  },
  computed: {
    baseUrl() {
      return process.env.BASE_URL
    }
  }
};
</script>
