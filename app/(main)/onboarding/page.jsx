"use client";

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Stethoscope, User } from 'lucide-react';
import useFetch from '@/hooks/use-fetch';
import { setUserRole } from '@/actions/onboarding';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SPECIALTIES } from '@/lib/specialities';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const doctorFormSchema = z.object({
    specialty:z.string().min(1, "Specialty is required"),
    experience: z
        .number()
        .min(1, "Experience must be atleast 1 year")
        .max(70, "Experience must be less than 70 years"),
    credentialUrl: z
        .string()
        .url("Please enter a value URL")
        .min(1, "Credential URL is required"),
    description: z
        .string()
        .min(20, "Description must be atleast 20 characters")
        .max(1000, "Description must be less than 1000 characters"),
});

const OnboardingPage = () => {
    const [step, setStep] = useState("choose-role");
    const router = useRouter();
    const { data, fn: submitUserRole, loading } = useFetch(setUserRole);

    const {register, 
        handleSubmit, 
        formState:{ errors },
        setValue,
        watch,
    } = useForm({
        resolver: zodResolver(doctorFormSchema),
        defaultValues: {
            specialty: "",
            experience: undefined,
            credentialUrl: "",
            description: "",
        },
    });

    const specialtyValue = watch("specialty");

    const handlePatientSelection = async () => {
        if(loading) return;

        const formData = new FormData();
        formData.append("role", "PATIENT");

        await submitUserRole(formData);
    };

    useEffect(() => {
        if(data && data?.success) {
            toast.success("Role selected")
            router.push(data.redirect);
        }
    }, [data]);

    const onDoctorSubmit = async (data) => {
        if (loading) return;

        const formData = new FormData();
        formData.append("role", "DOCTOR");
        formData.append("specialty", data.specialty);
        formData.append("experience", data.experience.toString());
        formData.append("credentialUrl", data.credentialUrl);
        formData.append("description", data.description);

        await submitUserRole(formData);
    }

    if(step === "choose-role") {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card 
            onClick={() => !loading && handlePatientSelection()}
            className="border-emerald-900/20 hover:border-emerald-700/40 cursor-pointer transition-all">
            <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
                <div className="p-4 bg-emerald-900/20 rounded-full mb-4">
                <User className="h-8 w-8 text-emerald-400" />
                </div>
                <CardTitle className="text-xl font-semibold text-white mb-2">
                Join as a Patient
                </CardTitle>
                <CardDescription className="mb-4">
                Book appointments, consult with doctors, and manage your
                healthcare journey
                </CardDescription>
                <Button
                className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700"
                disabled={loading}
                >
                {loading ? (
                    <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    </>
                ) : (
                    "Continue as a Patient"
                )}
                </Button>
            </CardContent>
            </Card>

            <Card
            className="border-emerald-900/20 hover:border-emerald-700/40 cursor-pointer transition-all"
            onClick={() => !loading && setStep("doctor-form")}
            >
            <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
                <div className="p-4 bg-emerald-900/20 rounded-full mb-4">
                <Stethoscope className="h-8 w-8 text-emerald-400" />
                </div>
                <CardTitle className="text-xl font-semibold text-white mb-2">
                Join as a Doctor
                </CardTitle>
                <CardDescription className="mb-4">
                Create your professional profile, set your availability, and
                provide consultations
                </CardDescription>
                <Button
                disabled={loading}
                className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700"
                >
                Continue as Doctor
                </Button>
            </CardContent>
            </Card>
        </div>
        );
    }

    if(step === "doctor-form") {
        return (
            <Card className="border-emerald-900/20 ">
            <CardContent className="pt-6 ">
                <div className='mb-6'>
                    <CardTitle className="text-2xl font-bold text-white mb-2">
                        Complete your Doctor Profile
                    </CardTitle>
                    <CardDescription>
                        Please provide your professional details for verification
                    </CardDescription>
                </div>

                    <form className='space-y-6' onSubmit={handleSubmit(onDoctorSubmit)}>
                        <div className='space-y-2'>
                            <Label htmlFor="specialty">Medical Speciality</Label>
                            <Select
                                value={specialtyValue}
                                onValueChange={(value) => setValue("specialty", value)}
                            >
                                <SelectTrigger id="specialty">
                                <SelectValue placeholder="Select your specialty" />
                                </SelectTrigger>
                                <SelectContent>
                                {SPECIALTIES.map((spec) => (
                                    <SelectItem
                                    key={spec.name}
                                    value={spec.name}
                                    className="flex items-center gap-2"
                                    >
                                    <span className="text-emerald-400">{spec.icon}</span>
                                    {spec.name}
                                    </SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                            {errors.specialty && (
                            <p className='text-sm font-medium text-red-500 mt-1'>
                                {errors.specialty.message}
                            </p>
                            )}
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor="exerience">Tears of Experience</Label>
                            <Input 
                                id="experience" 
                                type="number" 
                                placeholder="eg. 5"
                                {...register("experience", { valueAsNumber: true })}
                            />
                            {errors.experience && (
                            <p className='text-sm font-medium text-red-500 mt-1'>
                                {errors.experience.message}
                            </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="credentialUrl">Link to Credential Document</Label>
                            <Input
                                id="credentialUrl"
                                type="url"
                                placeholder="https://example.com/my-medical-degree.pdf"
                                {...register("credentialUrl")}
                            />
                            {errors.credentialUrl && (
                                <p className="text-sm font-medium text-red-500 mt-1">
                                {errors.credentialUrl.message}
                                </p>
                            )}
                            <p className="text-sm text-muted-foreground">
                                Please provide a link to your medical degree or certification
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description of Your Services</Label>
                            <Textarea
                                id="description"
                                placeholder="Describe your expertise, services, and approach to patient care..."
                                rows="4"
                                {...register("description")}
                            />
                            {errors.description && (
                                <p className="text-sm font-medium text-red-500 mt-1">
                                {errors.description.message}
                                </p>
                            )}
                        </div>

                        <div className="pt-2 flex items-center justify-between">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setStep("choose-role")}
                                className="border-emerald-900/30"
                                disabled={loading}
                            >
                                Back
                            </Button>
                            <Button
                                type="submit"
                                className="bg-emerald-600 hover:bg-emerald-700"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Submitting...
                                    </>
                                    ) : (
                                    "Submit for Verification"
                                    )}
                            </Button>
                        </div>
                    </form>
            </CardContent>
            </Card>
        );
    }


  return (
    <div></div>
  )
}

export default OnboardingPage