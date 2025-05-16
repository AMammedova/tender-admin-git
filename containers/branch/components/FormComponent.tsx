"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import dynamic from "next/dynamic"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"
import { branchService } from "@/lib/services/branchService";
import { Organization, organizationService } from "@/lib/services/organizationService";
import { formSchema } from "../constants/validations"

// Import MapPicker with no SSR and explicit .default handling
const MapPicker = dynamic(() => import("./map-picker").then((mod) => mod.default), {
  ssr: false,
  loading: () => <div className="h-[300px] flex items-center justify-center bg-gray-100">Loading map...</div>,
})

interface FormComponentProps {
  setIsDialogOpen: (value: boolean) => void
  onSubmit: (branch: any) => Promise<void>
  isLoading?: boolean
  branchId?: number | null
  initialValues?: any
}

const FormComponent: React.FC<FormComponentProps> = ({
  setIsDialogOpen,
  onSubmit,
  isLoading = false,
  branchId,
  initialValues,
}) => {
  const t = useTranslations("Branchs")
  const [isLoadingBranch, setIsLoadingBranch] = useState(false)
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [searchCoordinates, setSearchCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)

  // Initialize form with all required fields
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialValues?.name || "",
      code: typeof initialValues?.code === 'number' ? initialValues.code : null,
      address: {
        name: initialValues?.address?.name || "",
        latitude: initialValues?.address?.latitude || 0,
        longitude: initialValues?.address?.longitude || 0,
      },
    },
  })

  const address = form.watch("address")


  const handleMapChange = (newCoordinates:any) => {
    setCoordinates(newCoordinates);
  };


  // Make sure Leaflet is only loaded in browser
  useEffect(() => {
    setMapLoaded(true)
  }, [])

  const handleLocationSelect = (lat: number, lng: number) => {
    setCoordinates({ lat, lng })

    // Update form values and trigger validation
    form.setValue("address.latitude", lat, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
    form.setValue("address.longitude", lng, { shouldValidate: true, shouldDirty: true, shouldTouch: true })

    toast.success(`Location selected: ${lat.toFixed(6)}, ${lng.toFixed(6)}`)

    // Log to verify values are set
  }

  const handleSearchAddress = async () => {
    if (!address?.name?.trim()) return

    setLoading(true)
    try {
      // Use Nominatim API for geocoding (OpenStreetMap's geocoding service)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address.name)}&limit=1`,
      )

      if (!response.ok) {
        throw new Error("Failed to search for address")
      }

      const data = await response.json()

      if (data.length === 0) {
        toast.error("Could not find the location. Try a different address.")
        return
      }

      const result = data[0]
      const lat = Number.parseFloat(result.lat)
      const lng = Number.parseFloat(result.lon)

      // Update both state variables at once to avoid multiple renders
      const newCoords = { lat, lng }
      setCoordinates(newCoords)
      setSearchCoordinates(newCoords)

      // Update form values with explicit options
      form.setValue("address.latitude", lat, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
      form.setValue("address.longitude", lng, { shouldValidate: true, shouldDirty: true, shouldTouch: true })

      toast.success(`Found: ${result.display_name}`)

      // Log to verify values are set
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to search for address")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchBranchDetails = async () => {
      if (branchId) {
        setIsLoadingBranch(true)
        try {
          const response = await branchService.getBranchById(branchId)
          if (response.responseValue) {
            const branch = response.responseValue
            form.reset({
              name: branch.name,
              code: branch.code,
              address: {
                name: branch.address?.name || "",
                latitude: branch.address?.latitude || 0,
                longitude: branch.address?.longitude || 0,
              },
            })
            if (branch.address?.latitude && branch.address?.longitude) {
              const coords = {
                lat: Number(branch.address.latitude),
                lng: Number(branch.address.longitude),
              }
              setCoordinates(coords)
              setSearchCoordinates(coords)
            }
          }
        } catch (error) {
          console.error("Error fetching Branch details:", error)
        } finally {
          setIsLoadingBranch(false)
        }
      }
    }
    fetchBranchDetails()
  }, [branchId, form])



  const onFormSubmit = async (formData: z.infer<typeof formSchema>) => {
    try {
      const branchData = {
        name: formData.name,
        code: Number(formData.code),
        address: {
          name: formData.address.name,
          latitude: formData.address.latitude,
          longitude: formData.address.longitude,
        },
      };
      await onSubmit(branchData)
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6 p-6">
        {isLoadingBranch ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("name")}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t("namePlaceholder")} className="h-10" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("code")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      value={field.value === undefined || field.value === null ? "" : field.value}
                      onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder={t("codePlaceholder")}
                      className="h-10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="address.name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("address")}</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        {...field}
                        placeholder={t("addressPlaceholder") || "Enter address (e.g., Masazır)"}
                        className="h-10"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleSearchAddress}
                        disabled={!address?.name?.trim() || loading}
                      >
                        <Search className="h-4 w-4 mr-2" />
                        {t("search") || "Search"}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Map Picker */}
            {mapLoaded && (
              <div className="space-y-1">
                <Label>{t("selectLocation") || "Select Location on Map"}</Label>
                <div className="border rounded-md overflow-hidden h-[200px]">
                  <MapPicker onLocationSelect={handleLocationSelect} searchCoordinates={searchCoordinates} />
                </div>
              </div>
            )}

            {/* Coordinate fields - make sure they're properly registered */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                name="address.latitude"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("latitude") || "Latitude"}</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="address.longitude"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("longitude") || "Longitude"}</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* <FormField
              name="organizationId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("organization")}</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("organizationPlaceholder")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {organizations.map((organization) => (
                          <SelectItem key={organization.id} value={organization.id.toString()}>
                            {organization.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
          </>
        )}

        <div className="flex justify-end gap-4 mt-6">
          <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="w-[120px]">
            {t("cancel")}
          </Button>
          <Button type="submit" disabled={isLoading} className="w-[120px]">
            {isLoading ? t("saving") : t("save")}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default FormComponent


