"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import type QRCodeStyling from "qr-code-styling";
import { Options } from "qr-code-styling";

type DotType =
  | "rounded"
  | "dots"
  | "classy"
  | "classy-rounded"
  | "square"
  | "extra-rounded";
type CornerSquareType = "dot" | "square" | "extra-rounded";
type CornerDotType = "dot" | "square";
type GradientType = "linear" | "radial";
type FileExtension = "png" | "svg" | "jpeg";

const formSchema = z.object({
  text: z.string().min(1, "Text or URL is required"),
  dotsType: z.string(),
  cornerSquareType: z.string(),
  cornerDotType: z.string(),
  dotsColor: z.string(),
  bgColor: z.string(),
  cornerSquareColor: z.string(),
  cornerDotColor: z.string(),
  useGradient: z.boolean(),
  gradientType: z.string(),
  gradientStart: z.string(),
  gradientEnd: z.string(),
  logoMargin: z.number().min(0).max(50),
  logoSize: z.number().min(0.1).max(0.6),
  logoRounded: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;
interface QRCodeGeneratorModalProps {
  open: boolean;
  onOpenChange: (status: boolean) => void;
  initialText?: string;
  onFileGenerated?: (file: File) => void; // Optional callback to pass file to parent
}

export default function QRCodeGeneratorModal({
  open,
  onOpenChange,
  initialText = "https://example.com",
  onFileGenerated,
}: QRCodeGeneratorModalProps) {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string>("");
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: initialText,
      dotsType: "rounded",
      cornerSquareType: "extra-rounded",
      cornerDotType: "dot",
      dotsColor: "#000000",
      bgColor: "#ffffff",
      cornerSquareColor: "#000000",
      cornerDotColor: "#000000",
      useGradient: false,
      gradientType: "linear",
      gradientStart: "#667eea",
      gradientEnd: "#764ba2",
      logoMargin: 10,
      logoSize: 0.4,
      logoRounded: false,
    },
  });

  const watchedValues = form.watch();

  // Update text when initialText changes
  useEffect(() => {
    if (initialText) {
      form.setValue("text", initialText);
    }
  }, [initialText, form]);

  useEffect(() => {
    if (!open) return;

    const initQRCode = async () => {
      try {
        const QRCodeStylingModule = await import("qr-code-styling");
        const QRCodeStyling = QRCodeStylingModule.default;

        const options: Partial<Options> = {
          width: 300,
          height: 300,
          type: "canvas" as const,
          data: watchedValues.text,
          margin: 10,
          qrOptions: {
            typeNumber: 0,
            mode: "Byte" as const,
            errorCorrectionLevel: "H" as const,
          },
          dotsOptions: {
            color: watchedValues.useGradient
              ? watchedValues.gradientStart
              : watchedValues.dotsColor,
            type: watchedValues.dotsType as DotType,
            gradient: watchedValues.useGradient
              ? {
                  type: watchedValues.gradientType as GradientType,
                  rotation: 0,
                  colorStops: [
                    { offset: 0, color: watchedValues.gradientStart },
                    { offset: 1, color: watchedValues.gradientEnd },
                  ],
                }
              : undefined,
          },
          backgroundOptions: {
            color: watchedValues.bgColor,
          },
          cornersSquareOptions: {
            color: watchedValues.cornerSquareColor,
            type: watchedValues.cornerSquareType as CornerSquareType,
          },
          cornersDotOptions: {
            color: watchedValues.cornerDotColor,
            type: watchedValues.cornerDotType as CornerDotType,
          },
          imageOptions: logoUrl
            ? {
                crossOrigin: "anonymous" as const,
                margin: watchedValues.logoMargin,
                imageSize: watchedValues.logoSize,
              }
            : undefined,
          image: logoUrl || undefined,
        };

        if (!qrCode.current) {
          qrCode.current = new QRCodeStyling(options);
          if (qrCodeRef.current) {
            qrCodeRef.current.innerHTML = "";
            qrCode.current.append(qrCodeRef.current);
          }
        } else {
          qrCode.current.update(options);
        }
      } catch (error) {
        console.error("Failed to initialize QR code:", error);
      }
    };

    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      initQRCode();
    }, 100);

    return () => clearTimeout(timer);
  }, [open, watchedValues, logoUrl]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (!ctx) return;

          const size = Math.min(img.width, img.height);
          canvas.width = size;
          canvas.height = size;

          // If rounded is enabled, create circular mask
          if (watchedValues.logoRounded) {
            ctx.beginPath();
            ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
          }

          // Draw the image centered
          const offsetX = (img.width - size) / 2;
          const offsetY = (img.height - size) / 2;
          ctx.drawImage(img, -offsetX, -offsetY);

          setLogoUrl(canvas.toDataURL("image/png"));
          setLogoFile(file);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoUrl("");
    setLogoFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const downloadQR = (extension: FileExtension) => {
    if (qrCode.current) {
      // For high quality download, regenerate at higher resolution
      const originalWidth = 300;
      const downloadWidth = 2000; // High resolution for downloads

      const tempQR = qrCode.current;
      const currentOptions: Partial<Options> = {
        width: downloadWidth,
        height: downloadWidth,
        type: "canvas" as const,
        data: watchedValues.text,
        margin: 10,
        qrOptions: {
          typeNumber: 0,
          mode: "Byte" as const,
          errorCorrectionLevel: "H" as const,
        },
        dotsOptions: {
          color: watchedValues.useGradient
            ? watchedValues.gradientStart
            : watchedValues.dotsColor,
          type: watchedValues.dotsType as DotType,
          gradient: watchedValues.useGradient
            ? {
                type: watchedValues.gradientType as GradientType,
                rotation: 0,
                colorStops: [
                  { offset: 0, color: watchedValues.gradientStart },
                  { offset: 1, color: watchedValues.gradientEnd },
                ],
              }
            : undefined,
        },
        backgroundOptions: {
          color: watchedValues.bgColor,
        },
        cornersSquareOptions: {
          color: watchedValues.cornerSquareColor,
          type: watchedValues.cornerSquareType as CornerSquareType,
        },
        cornersDotOptions: {
          color: watchedValues.cornerDotColor,
          type: watchedValues.cornerDotType as CornerDotType,
        },
        imageOptions: logoUrl
          ? {
              crossOrigin: "anonymous" as const,
              margin: watchedValues.logoMargin,
              imageSize: watchedValues.logoSize,
            }
          : undefined,
        image: logoUrl || undefined,
      };

      // Create temporary high-res QR code for download
      import("qr-code-styling").then((QRCodeStylingModule) => {
        const QRCodeStyling = QRCodeStylingModule.default;
        const highResQR = new QRCodeStyling(currentOptions);
        highResQR.download({ name: "qrcode", extension });
        toast.success(`QR code downloaded as ${extension.toUpperCase()}`);
      });
    }
  };

  async function onSubmit(values: FormValues) {
    try {
      if (!qrCode.current) {
        toast.error("QR code not ready. Please wait a moment.");
        return;
      }

      toast.loading("Generating QR code file...");

      // Get the canvas element from the QR code
      const canvas = qrCodeRef.current?.querySelector("canvas");

      if (!canvas) {
        toast.dismiss();
        toast.error("Failed to generate QR code file.");
        return;
      }

      // Convert canvas to blob
      canvas.toBlob(
        async (blob) => {
          if (!blob) {
            toast.dismiss();
            toast.error("Failed to generate QR code file.");
            return;
          }

          const file = new File([blob], "qrcode.png", { type: "image/png" });

          toast.dismiss();
          toast.success("QR code generated successfully!");

          // Console log for debugging
          console.log("QR Code File:", file);
          console.log("File size:", file.size, "bytes");
          console.log("File type:", file.type);

          // If callback provided, pass file to parent component
          if (onFileGenerated) {
            onFileGenerated(file);
          }

          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.download = file.name;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
          onOpenChange(false);
        },
        "image/png",
        1.0
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.dismiss();
      toast.error("Failed to generate QR code. Please try again.");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          form.reset();
          setLogoFile(null);
          setLogoUrl("");
        }
        onOpenChange(isOpen);
      }}
    >
      <DialogContent className="w-full max-w-sm sm:max-w-3xl md:max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Generate QR Code</DialogTitle>
          <DialogDescription>
            Customize your QR code with advanced styling options. Download when
            you are done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="qr-generator-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Left Column - Content & Basic Settings */}
            <div className="flex flex-col space-y-5">
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Text or URL</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter text or URL"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bgColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Background Color</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={field.value}
                          onChange={field.onChange}
                          className="w-12 h-10 rounded-md cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={field.value}
                          onChange={field.onChange}
                          className="flex-1"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <Label>Logo/Image (Optional)</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  className="block w-full text-center px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors text-sm"
                >
                  {logoFile ? logoFile.name : "Click to upload logo"}
                </label>
                {logoFile && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={removeLogo}
                    className="w-full"
                  >
                    Remove Logo
                  </Button>
                )}
              </div>

              {logoUrl && (
                <>
                  <FormField
                    control={form.control}
                    name="logoRounded"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Rounded Logo (Circle)</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                              // Re-process the logo when toggling
                              if (fileInputRef.current?.files?.[0]) {
                                const file = fileInputRef.current.files[0];
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  const img = new Image();
                                  img.onload = () => {
                                    const canvas =
                                      document.createElement("canvas");
                                    const ctx = canvas.getContext("2d");

                                    if (!ctx) return;

                                    const size = Math.min(
                                      img.width,
                                      img.height
                                    );
                                    canvas.width = size;
                                    canvas.height = size;

                                    if (checked) {
                                      ctx.beginPath();
                                      ctx.arc(
                                        size / 2,
                                        size / 2,
                                        size / 2,
                                        0,
                                        Math.PI * 2
                                      );
                                      ctx.closePath();
                                      ctx.clip();
                                    }

                                    const offsetX = (img.width - size) / 2;
                                    const offsetY = (img.height - size) / 2;
                                    ctx.drawImage(img, -offsetX, -offsetY);

                                    setLogoUrl(canvas.toDataURL("image/png"));
                                  };
                                  img.src = event.target?.result as string;
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="logoSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Logo Size: {(field.value * 100).toFixed(0)}%
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="range"
                            min="0.1"
                            max="0.6"
                            step="0.05"
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                            className="w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="logoMargin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Logo Margin: {field.value}px</FormLabel>
                        <FormControl>
                          <Input
                            type="range"
                            min="0"
                            max="50"
                            step="5"
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                            className="w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>

            {/* Middle Column - Style Settings */}
            <div className="flex flex-col space-y-5">
              <FormField
                control={form.control}
                name="dotsType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dots Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="rounded">Rounded</SelectItem>
                        <SelectItem value="dots">Dots</SelectItem>
                        <SelectItem value="classy">Classy</SelectItem>
                        <SelectItem value="classy-rounded">
                          Classy Rounded
                        </SelectItem>
                        <SelectItem value="square">Square</SelectItem>
                        <SelectItem value="extra-rounded">
                          Extra Rounded
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="useGradient"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Use Gradient</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {!watchedValues.useGradient ? (
                <FormField
                  control={form.control}
                  name="dotsColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dots Color</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={field.value}
                            onChange={field.onChange}
                            className="w-12 h-10 rounded-md cursor-pointer"
                          />
                          <Input
                            type="text"
                            value={field.value}
                            onChange={field.onChange}
                            className="flex-1"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <>
                  <FormField
                    control={form.control}
                    name="gradientType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gradient Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="linear">Linear</SelectItem>
                            <SelectItem value="radial">Radial</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="gradientStart"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Color</FormLabel>
                          <FormControl>
                            <input
                              type="color"
                              value={field.value}
                              onChange={field.onChange}
                              className="w-full h-10 rounded-md cursor-pointer"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gradientEnd"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Color</FormLabel>
                          <FormControl>
                            <input
                              type="color"
                              value={field.value}
                              onChange={field.onChange}
                              className="w-full h-10 rounded-md cursor-pointer"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}

              <FormField
                control={form.control}
                name="cornerSquareType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Corner Square Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="dot">Dot</SelectItem>
                        <SelectItem value="square">Square</SelectItem>
                        <SelectItem value="extra-rounded">
                          Extra Rounded
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cornerDotType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Corner Dot Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="dot">Dot</SelectItem>
                        <SelectItem value="square">Square</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cornerSquareColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Square Color</FormLabel>
                      <FormControl>
                        <input
                          type="color"
                          value={field.value}
                          onChange={field.onChange}
                          className="w-full h-10 rounded-md cursor-pointer"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cornerDotColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dot Color</FormLabel>
                      <FormControl>
                        <input
                          type="color"
                          value={field.value}
                          onChange={field.onChange}
                          className="w-full h-10 rounded-md cursor-pointer"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex flex-col space-y-5">
              <div className="flex flex-col">
                <Label className="mb-2">Preview</Label>
                <div className="flex justify-center items-center bg-muted rounded-lg min-h-[300px] max-h-[300px] aspect-square overflow-hidden">
                  <div
                    ref={qrCodeRef}
                    className="max-w-full w-full aspect-square object-cover flex justify-center items-center h-auto p-0 mx-0"
                  ></div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={() => downloadQR("png")}
                  className="flex-1"
                  size="sm"
                >
                  PNG
                </Button>
                <Button
                  type="button"
                  onClick={() => downloadQR("svg")}
                  className="flex-1"
                  size="sm"
                  variant="outline"
                >
                  SVG
                </Button>
                <Button
                  type="button"
                  onClick={() => downloadQR("jpeg")}
                  className="flex-1"
                  size="sm"
                  variant="outline"
                >
                  JPG
                </Button>
              </div>
            </div>
          </form>
        </Form>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button form="qr-generator-form" type="submit">
            Generate QR Code
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
