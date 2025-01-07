<template>
    <div
        class="h-full md:col-span-12 col-span-12 w-full relative"
        style="min-height: 2rem"
    >
        <div
            v-if="card.resettable"
            class="z-10 absolute top-0 mt-2 right-0 mr-2"
        >
            <Link
                @click="resetFilters(card.filters)"
                class="text-xs font-semibold mr-2"
            >
                {{ __("Reset") }}
            </Link>
        </div>
        <LoadingCard
            :loading="loading"
            class="md:col-span-12 h-full"
            v-if="card.filters.length > 0"
        >
            <ScrollWrap
                class="items-start h-full grid md:grid-cols-12 gap-6 py-4 px-6"
            >
                <div
                    v-for="(filter, index) in card.filters"
                    :key="index"
                    class="self-start"
                    :class="{
                        'md:col-span-6': card.filters.length <= 2,
                        'md:col-span-4': card.filters.length === 3,
                        'md:col-span-3': card.filters.length >= 4,
                    }"
                >
                    <div class="w-full">
                        <span class="leading-tight text-sm font-semibold">
                            {{ filter.name }}
                        </span>
                        <input
                            class="w-full flex form-control form-control-sm form-input form-input-bordered"
                            type="date"
                            :dusk="`${filter.name}-date-filter`"
                            :id="filter.name"
                            v-if="filter.component === 'date-filter'"
                            name="date-filter"
                            autocomplete="off"
                            :value="filter.value || filter.currentValue"
                            :placeholder="__('Choose date')"
                            @input.prevent=""
                            alt-format="Y-m-d"
                            date-format="Y-m-d"
                            :enable-time="false"
                            :enable-seconds="false"
                            @change="handleChange(filter, $event)"
                        />

                        <div
                            v-if="filter.component === 'boolean-filter'"
                            class="space-y-2 mt-2"
                        >
                            <CheckboxWithLabel
                                :dusk="`${option.value}-checkbox`"
                                v-for="option in filter.options"
                                :key="option.label"
                                :name="option.label"
                                :checked="option.checked"
                                @input="handleChange(filter, $event)"
                            >
                                {{ option.label }}
                            </CheckboxWithLabel>
                        </div>

                        <SelectControl
                            :id="filter.name"
                            v-if="filter.component === 'select-filter'"
                            @change="handleChange(filter, $event)"
                            class="w-full block"
                            :options="filter.options"
                        >
                            <option value="" :selected="value == ''">
                                &mdash;
                            </option>
                        </SelectControl>
                    </div>
                </div>
            </ScrollWrap>
        </LoadingCard>
    </div>
</template>

<script>
    import { Filterable } from "laravel-nova-mixins";

    export default {
        mixins: [Filterable],
        props: {
            loading: { default: false },
            card: {
                type: Object,
                required: true,
            },
        },
        computed: {
            /**
             * The current route parameters
             */
            routeParameters() {
                const searchParams = new URLSearchParams(
                    window.location.search
                );
                return Object.fromEntries(searchParams.entries());
            },
        },
        data: () => ({
            selectedCheckboxs: {
                type: Object,
            },
            value: null,
        }),
        created() {
            Nova.$on("global-filter-request", (filterClasses) => {
                let filters =
                    this.card.filters !== undefined ? this.card.filters : [];

                if (filterClasses && filterClasses.length) {
                    filters = filters.filter((filter) =>
                        filterClasses.includes(filter.class)
                    );
                }
                Nova.$emit("global-filter-response", filters);
            });
        },
        methods: {
            handleChange(filter, event) {
                let value = event;
                if (typeof event === "object") {
                    value = event.target.value;
                }

                if (filter.component === "boolean-filter") {
                    if (event.target.checked) {
                        this.selectedCheckboxs[event.target.name] = 1;
                    } else {
                        delete this.selectedCheckboxs[event.target.name];
                    }
                    value = this.selectedCheckboxs;
                }

                if (filter.currentValue !== value) {
                    filter.currentValue = value;
                    Nova.$emit("global-filter-changed", filter);
                }
            },
            resetFilters() {
                this.filters = [];
                Nova.$emit("filter-reset", this.filters);
            },
        },
    };
</script>
