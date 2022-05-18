<script>
    import { minimum } from "@/util";
    import FilterBehavior from "./FilterBehavior";
    import ProgressMetric from "@/components/Metrics/ProgressMetric";

    export default {
        extends: ProgressMetric,
        mixins: [FilterBehavior],

        methods: {
            fetch() {
                this.loading = true;

                minimum(
                    Nova.request().get(
                        this.metricEndpoint,
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
