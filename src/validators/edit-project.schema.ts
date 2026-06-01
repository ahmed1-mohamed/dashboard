import { z } from 'zod';

export const editProjectSchema = z
  .object({
    developer_id: z.number(),
    // ✅ Location section (uncommented and aligned with your useEffect)
    latitude: z.string().nonempty('Latitude is required'),
    longitude: z.string().nonempty('Longitude is required'),
    landmark: z.string().nonempty('Landmark is required'),
    north_side: z.string().nonempty('North side is required'),
    south_side: z.string().nonempty('South side is required'),
    east_side: z.string().nonempty('East side is required'),
    west_side: z.string().nonempty('West side is required'),
    google_map_link: z.string().url('Must be a valid Google Maps URL'),

    // location: z.object({
    //   latitude: z.number(),
    //   longitude: z.number(),
    //   landmark: z.string(),
    //   city_id: z.string(),
    //   northSide: z.string(),
    //   southSide: z.string(),
    //   eastSide: z.string(),
    //   westSide: z.string(),
    // }),
    project_name: z.string().min(1, 'Project name is required'),
    total_units: z.number().min(1, 'Total units must be at least 1'),
    available_units: z.number().min(0, 'Available units cannot be negative'),
    launch_date: z.string().min(1, 'Launch date is required'),
    completion_date: z.string().min(1, 'Completion date is required'),
    status: z.enum(['completed', 'ongoing', 'upcoming']),
    project_type: z.enum(['residential', 'commercial', 'mixed-use']),
    // price_range: z.string().min(1, 'Price range is required'),
    description: z.string().min(1, 'Description is required'),
    // price_range_SQ: z.string().min(1, 'Price_range_SQ is required'),
    project_size: z.string().min(1, 'Project Size is required'),
    price_min: z.string().nonempty('Min price required'),
    price_max: z.string().nonempty('Max price required'),
    price_sq_min: z.string().nonempty('Min price SQ required'),
    price_sq_max: z.string().nonempty('Max price SQ required'),
    is_active: z.enum(['1', '0', '2']),
    currency: z.enum(['EGP', 'USD', 'AED']),
    permit_no: z.string().nullable().optional(),
    // parcode: z.instanceof(File).refine(
    //   (file) => file.size <= 0.25 * 1024 * 1024, // optional: 5MB max
    //   'Image size must be less than 256 KB'
    // ),
  })
  .refine(
    (data) =>
      data.launch_date.trim() !== '' &&
      data.completion_date.trim() !== '' &&
      new Date(data.launch_date) <= new Date(data.completion_date),
    {
      path: ['completion_date'],
      message: 'Completion date must be after or equal to launch date.',
    }
  );

export type EditProjectInput = z.infer<typeof editProjectSchema>;
