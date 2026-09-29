import * as React from "react";
import CreatableSelect from "react-select/creatable";
import type { StylesConfig, GroupBase } from "react-select";

export interface SelectOption {
    value: string;
    label: string;
}

interface CreatableSelectFieldProps {
    /** id untuk dikaitkan dengan <Label htmlFor="..."> */
    id?: string;
    /** Nilai terpilih (string). Boleh berupa nilai yang belum ada di daftar opsi. */
    value: string;
    /** Dipanggil ketika pengguna memilih opsi yang ada ATAU membuat opsi baru. */
    onChange: (value: string) => void;
    /** Opsi bawaan (value = nilai yang disimpan, label = teks tampilan). */
    options: SelectOption[];
    /**
     * Nilai tambahan yang ikut dijadikan opsi, mis. kategori/spesialisasi yang
     * pernah dibuat pada data lain sehingga tidak perlu diketik ulang.
     */
    extraValues?: string[];
    placeholder?: string;
    isDisabled?: boolean;
    /** Teks pada opsi "buat baru". Default: Tambah "xxx" */
    createLabel?: (input: string) => string;
}

// Warna mengikuti tema aplikasi (primary = #e02875).
const PRIMARY = "#e02875";
const PRIMARY_SOFT = "rgba(224, 40, 117, 0.08)";
const PRIMARY_RING = "rgba(224, 40, 117, 0.2)";

const selectStyles: StylesConfig<SelectOption, false, GroupBase<SelectOption>> = {
    control: (base, state) => ({
        ...base,
        minHeight: 40,
        borderRadius: 6,
        backgroundColor: "#ffffff",
        borderColor: state.isFocused ? PRIMARY : "#e2e8f0",
        boxShadow: state.isFocused ? `0 0 0 2px ${PRIMARY_RING}` : "none",
        fontSize: 14,
        cursor: "pointer",
        "&:hover": { borderColor: state.isFocused ? PRIMARY : "#cbd5e1" },
    }),
    valueContainer: (base) => ({ ...base, padding: "2px 12px" }),
    placeholder: (base) => ({ ...base, color: "#94a3b8" }),
    singleValue: (base) => ({ ...base, color: "#1e293b" }),
    input: (base) => ({ ...base, color: "#1e293b" }),
    indicatorSeparator: () => ({ display: "none" }),
    dropdownIndicator: (base, state) => ({
        ...base,
        color: "#94a3b8",
        transition: "transform 150ms",
        transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : undefined,
        "&:hover": { color: "#64748b" },
    }),
    menu: (base) => ({
        ...base,
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid #e2e8f0",
        boxShadow: "0 10px 30px -10px rgba(15, 23, 42, 0.25)",
        marginTop: 6,
        zIndex: 9999,
    }),
    // Menu di-portal ke <body> agar tidak terpotong oleh modal (overflow-hidden)
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    menuList: (base) => ({ ...base, padding: 6, maxHeight: 240 }),
    option: (base, state) => ({
        ...base,
        borderRadius: 8,
        fontSize: 14,
        cursor: "pointer",
        color: state.isSelected ? "#ffffff" : "#1e293b",
        backgroundColor: state.isSelected
            ? PRIMARY
            : state.isFocused
                ? PRIMARY_SOFT
                : "transparent",
        "&:active": { backgroundColor: state.isSelected ? PRIMARY : PRIMARY_SOFT },
    }),
    noOptionsMessage: (base) => ({ ...base, fontSize: 13, color: "#64748b" }),
};

/**
 * Dropdown dengan kemampuan membuat opsi baru (react-select/creatable).
 * Pengguna dapat memilih dari daftar, atau mengetik lalu menekan Enter /
 * klik "Tambah ..." untuk membuat nilai baru.
 */
export function CreatableSelectField({
    id,
    value,
    onChange,
    options,
    extraValues = [],
    placeholder = "Pilih atau ketik untuk menambah...",
    isDisabled,
    createLabel,
}: CreatableSelectFieldProps) {
    // Gabungkan opsi bawaan + nilai tambahan + nilai saat ini (tanpa duplikat)
    const mergedOptions = React.useMemo<SelectOption[]>(() => {
        const result: SelectOption[] = [...options];
        const seen = new Set(
            result.flatMap((o) => [o.value.toLowerCase(), o.label.toLowerCase()])
        );

        [...extraValues, value].forEach((raw) => {
            const v = (raw || "").trim();
            if (!v || seen.has(v.toLowerCase())) return;
            seen.add(v.toLowerCase());
            result.push({ value: v, label: v });
        });

        return result;
    }, [options, extraValues, value]);

    const selected = React.useMemo(
        () => mergedOptions.find((o) => o.value === value) ?? null,
        [mergedOptions, value]
    );

    return (
        <CreatableSelect<SelectOption, false>
            inputId={id}
            instanceId={id}
            options={mergedOptions}
            value={selected}
            onChange={(opt) => onChange(opt ? opt.value : "")}
            onCreateOption={(input) => {
                const trimmed = input.trim().replace(/\s+/g, " ");
                if (!trimmed) return;
                // Jika sudah ada (beda huruf besar/kecil), pakai yang sudah ada
                const existing = mergedOptions.find(
                    (o) =>
                        o.value.toLowerCase() === trimmed.toLowerCase() ||
                        o.label.toLowerCase() === trimmed.toLowerCase()
                );
                onChange(existing ? existing.value : trimmed);
            }}
            placeholder={placeholder}
            isDisabled={isDisabled}
            isClearable={false}
            formatCreateLabel={createLabel ?? ((input) => `Tambah "${input.trim()}"`)}
            noOptionsMessage={() => "Ketik untuk membuat opsi baru"}
            styles={selectStyles}
            menuPortalTarget={typeof document !== "undefined" ? document.body : null}
            menuPosition="fixed"
        />
    );
}