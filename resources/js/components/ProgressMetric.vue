<script>
    import { minimum } from "@/util";
    import FilterBehavior from "./FilterBehavior";
    import ProgressMetric from "@/components/Metrics/ProgressMetric";

    export default {
        extends: ProgressMetric,
        mixins: [FilterBehavior],
        computed: {
            /**
             * Get the correct metric endpoint based on context
             */
            correctMetricEndpoint() {
                // If we're on a dashboard, use the dashboard metric endpoint
                if (this.$route && this.$route.name === 'nova-dashboard') {
                    return `/nova-api/dashboards/cards/${this.$route.params.dashboard}/metrics/${this.uriKey}`;
                }
                
                // Otherwise use the default metric endpoint
                return this.metricEndpoint;
            }
        },
        methods: {
            fetch() {
                this.loading = true;

                minimum(
                    Nova.request().get(
                        this.correctMetricEndpoint,
                        this.filterPayload()
                    )
                ).then(
                    ({
                        data: {
                            value: {
                                value,
                                target,
                                percentage,
                                prefix,
                                suffix,
                                suffixInflection,
                                format,
                                avoid,
                            },
                        },
                    }) => {
                        this.value = value;
                        this.target = target;
                        this.percentage = percentage;
                        this.format = format || this.format;
                        this.avoid = avoid;
                        this.prefix = prefix || this.prefix;
                        this.suffix = suffix || this.suffix;
                        this.suffixInflection = suffixInflection;
                        this.loading = false;
                    }
                );
            },
        },
    };
</script>
