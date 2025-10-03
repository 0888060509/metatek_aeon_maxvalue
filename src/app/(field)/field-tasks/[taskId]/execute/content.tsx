
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ChevronLeft, Camera, X, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Client Component for task execution UI and logic
export function TaskExecutionPageContent({ taskId }: { taskId: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    
    // Mock data for a single task's execution criteria
    const taskExecutionData = {
        id: 'TSK-003',
        title: 'Holiday Promo Setup',
        description: 'Set up the main promotional display for the holiday season according to the provided planogram.',
        store: 'Eastside',
        dueDate: '2023-10-18',
        isRework: false,
        rejectionReason: '',
        criteria: [
            {
              id: 'crit-1',
              requirement: 'Chụp ảnh toàn cảnh khu vực trưng bày và đối chiếu với guideline',
              type: 'visual-compliance-ai',
              planogramImageId: 'task-image-2' 
            },
            {
              id: 'crit-2',
              requirement: 'Hoàn thành checklist vệ sinh khu vực trưng bày',
              type: 'checklist',
              checklistItems: [
                { id: 'c2-1', label: 'Lau sạch bụi trên kệ', checked: false },
                { id: 'c2-2', label: 'Sắp xếp sản phẩm gọn gàng, đúng hàng lối', checked: false },
                { id: 'c2-3', label: 'Kiểm tra và thay thế bảng giá bị hỏng', checked: false },
                { id: 'c2-4', label: 'Dọn dẹp rác xung quanh khu vực', checked: false },
              ]
            },
            {
                id: 'crit-3',
                requirement: 'Bảng hiệu khuyến mãi đã được đặt ở đúng vị trí chưa?',
                type: 'multiple-choice',
                options: [
                    { label: 'Đúng vị trí' },
                    { label: 'Sai vị trí' },
                    { label: 'Chưa có bảng hiệu' },
                ],
                selectedOption: ''
            },
            {
                id: 'crit-4',
                requirement: 'Báo cáo các vấn đề phát sinh (nếu có)',
                type: 'text-input',
                value: ''
            },
            {
                id: 'crit-5',
                requirement: 'Nhập số lượng sản phẩm tồn kho trên kệ',
                type: 'number-input',
                value: ''
            },
            {
                id: 'crit-6',
                requirement: 'Chụp ảnh chi tiết các góc của khu vực trưng bày (tối thiểu 3 ảnh)',
                type: 'photo-capture',
                minPhotos: 3,
            }
        ],
    };

    const reworkTaskData = {
        ...taskExecutionData,
        isRework: true,
        rejectionReason: 'Sản phẩm "Festive Soda" đặt sai vị trí so với planogram. Planogram yêu cầu đặt ở kệ thứ 2, ảnh chụp cho thấy sản phẩm ở kệ thứ 3.',
        criteria: [
            { ...taskExecutionData.criteria[0] }, // visual compliance
            { // checklist with some items checked
              ...taskExecutionData.criteria[1],
              checklistItems: [
                { id: 'c2-1', label: 'Lau sạch bụi trên kệ', checked: true },
                { id: 'c2-2', label: 'Sắp xếp sản phẩm gọn gàng, đúng hàng lối', checked: true },
                { id: 'c2-3', label: 'Kiểm tra và thay thế bảng giá bị hỏng', checked: false },
                { id: 'c2-4', label: 'Dọn dẹp rác xung quanh khu vực', checked: true },
              ]
            },
            { // multiple choice with an option selected
                ...taskExecutionData.criteria[2],
                selectedOption: 'Đúng vị trí'
            },
            {...taskExecutionData.criteria[3], value: 'Khách hàng phàn nàn về việc khó tìm thấy sản phẩm khuyến mãi.'},
            {...taskExecutionData.criteria[4], value: '150'},
            {...taskExecutionData.criteria[5]},
        ]
    };
    
    const isRework = searchParams.get('rework') === 'true';

    const [taskData, setTaskData] = React.useState(isRework ? reworkTaskData : taskExecutionData);
    const [capturedImages, setCapturedImages] = React.useState<Record<string, string[]>>(() => {
        const initialImages: Record<string, string[]> = {};
        if (isRework) {
            const visualComplianceImg = PlaceHolderImages.find(p => p.id === 'review-image-1')?.imageUrl;
            if (visualComplianceImg) {
                initialImages['crit-1'] = [visualComplianceImg];
            }
            const photoCaptureImg1 = PlaceHolderImages.find(p => p.id === 'task-image-1')?.imageUrl;
            const photoCaptureImg2 = PlaceHolderImages.find(p => p.id === 'task-image-2')?.imageUrl;
            if(photoCaptureImg1 && photoCaptureImg2) {
                initialImages['crit-6'] = [photoCaptureImg1, photoCaptureImg2];
            }
        }
        return initialImages;
    });

    const handleChecklistChange = (criterionId: string, itemId: string, checked: boolean) => {
        setTaskData(prevData => ({
            ...prevData,
            criteria: prevData.criteria.map(c => {
                if (c.id === criterionId && c.type === 'checklist') {
                    return {
                        ...c,
                        checklistItems: c.checklistItems.map(item =>
                            item.id === itemId ? { ...item, checked } : item
                        )
                    };
                }
                return c;
            })
        }));
    };

    const handleMultipleChoiceChange = (criterionId: string, value: string) => {
        setTaskData(prevData => ({
            ...prevData,
            criteria: prevData.criteria.map(c =>
                c.id === criterionId && c.type === 'multiple-choice' ? { ...c, selectedOption: value } : c
            )
        }));
    };
    
    const handleTextChange = (criterionId: string, value: string) => {
        setTaskData(prevData => ({
            ...prevData,
            criteria: prevData.criteria.map(c =>
                c.id === criterionId && (c.type === 'text-input' || c.type === 'number-input') ? { ...c, value } : c
            )
        }));
    };

    const handleCaptureImage = (criterionId: string) => {
        // This is a mock function. In a real app, this would open the camera.
        const mockImage = PlaceHolderImages.find(p => p.id === 'task-image-1');
        if (mockImage) {
            setCapturedImages(prev => ({
                ...prev,
                [criterionId]: [...(prev[criterionId] || []), mockImage.imageUrl]
            }));
        }
    };
    
    const handleRemoveImage = (criterionId: string, index: number) => {
        setCapturedImages(prev => ({
            ...prev,
            [criterionId]: (prev[criterionId] || []).filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = () => {
        console.log("Submitting task report:", { taskData, capturedImages });
        toast({
            title: `Báo cáo đã được ${isRework ? 'nộp lại' : 'gửi'}`,
            description: `Cảm ơn bạn. Báo cáo của bạn đã được gửi đi để xét duyệt.`,
        });
        // Redirect back to the task list after submission
        router.push('/tasks');
    };

    const renderCriterion = (criterion: any) => {
        const images = capturedImages[criterion.id] || [];

        const imageGrid = (criterionId: string) => (
             <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mt-2">
                {images.map((imgSrc, index) => (
                    <Dialog key={index}>
                        <DialogTrigger asChild>
                            <div className="relative group aspect-square cursor-pointer">
                                <Image src={imgSrc} alt={`Captured image ${index + 1}`} fill sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw" className="rounded-md object-cover"/>
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                                    <span className="text-white text-xs font-semibold">Xem ảnh</span>
                                </div>
                            </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                             <DialogHeader>
                                <DialogTitle>Xem lại ảnh đã chụp</DialogTitle>
                                <DialogDescription>
                                    Ảnh {index + 1} của tiêu chuẩn "{criterion.requirement}"
                                </DialogDescription>
                            </DialogHeader>
                             <div className="relative">
                                <Image src={imgSrc} alt={`Captured image ${index + 1}`} width={1920} height={1080} className="rounded-md object-contain max-h-[70vh]"/>
                             </div>
                             <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="destructive" onClick={() => handleRemoveImage(criterionId, index)}>
                                        <X className="mr-2 h-4 w-4" />
                                        Xóa ảnh
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                ))}
                <Button variant="outline" className="flex flex-col items-center justify-center aspect-square border-dashed hover:bg-accent h-full w-full p-0" onClick={() => handleCaptureImage(criterion.id)}>
                    <Camera className="h-8 w-8 text-muted-foreground"/>
                    <span className="text-xs mt-2 text-muted-foreground">Chụp ảnh</span>
                </Button>
            </div>
        );


        switch (criterion.type) {
            case 'visual-compliance-ai':
                const planogramImage = PlaceHolderImages.find(p => p.id === criterion.planogramImageId);
                return (
                     <Card>
                        <CardContent className="pt-6 space-y-4">
                            {planogramImage && (
                                <div>
                                    <Label className="font-semibold">Planogram tham khảo</Label>
                                    <Image 
                                        src={planogramImage.imageUrl} 
                                        alt="Planogram"
                                        width={600}
                                        height={400}
                                        className="rounded-md object-cover mt-2 border"
                                        data-ai-hint={planogramImage.imageHint}
                                    />
                                </div>
                            )}
                            <div>
                               <Label className="font-semibold">Ảnh chụp thực tế</Label>
                               {imageGrid(criterion.id)}
                            </div>
                        </CardContent>
                    </Card>
                );

            case 'checklist':
                return (
                    <Card>
                        <CardContent className="pt-6 space-y-3">
                            {criterion.checklistItems.map((item: any) => (
                                <div key={item.id} className="flex items-center gap-3 p-3 rounded-md bg-secondary/50">
                                    <Checkbox
                                        id={item.id}
                                        checked={item.checked}
                                        onCheckedChange={(checked) => handleChecklistChange(criterion.id, item.id, !!checked)}
                                    />
                                    <Label htmlFor={item.id} className="flex-1 text-sm font-normal">
                                        {item.label}
                                    </Label>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                );
            
            case 'multiple-choice':
                return (
                    <Card>
                        <CardContent className="pt-6">
                            <RadioGroup value={criterion.selectedOption} onValueChange={(value) => handleMultipleChoiceChange(criterion.id, value)}>
                                <div className="space-y-2">
                                {criterion.options.map((option: any, index: number) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <RadioGroupItem value={option.label} id={`option-${criterion.id}-${index}`} />
                                        <Label htmlFor={`option-${criterion.id}-${index}`}>{option.label}</Label>
                                    </div>
                                ))}
                                </div>
                            </RadioGroup>
                        </CardContent>
                    </Card>
                );
            
            case 'text-input':
                return (
                    <Card>
                        <CardContent className="pt-6">
                            <Textarea
                                placeholder="Nhập báo cáo của bạn ở đây..."
                                value={criterion.value}
                                onChange={(e) => handleTextChange(criterion.id, e.target.value)}
                                rows={4}
                            />
                        </CardContent>
                    </Card>
                );

            case 'number-input':
                return (
                    <Card>
                        <CardContent className="pt-6">
                            <Input
                                type="number"
                                placeholder="Nhập số liệu..."
                                value={criterion.value}
                                onChange={(e) => handleTextChange(criterion.id, e.target.value)}
                            />
                        </CardContent>
                    </Card>
                );

            case 'photo-capture':
                 return (
                     <Card>
                        <CardContent className="pt-6 space-y-4">
                            <div>
                               <Label className="font-semibold">Ảnh đã chụp ({images.length}/{criterion.minPhotos})</Label>
                               {imageGrid(criterion.id)}
                               {images.length < criterion.minPhotos && (
                                   <p className="text-xs text-destructive mt-2">Cần chụp thêm {criterion.minPhotos - images.length} ảnh.</p>
                               )}
                            </div>
                        </CardContent>
                    </Card>
                );

            default:
                return null;
        }
    };


    return (
        <div className="space-y-4 pb-24 2xl:pb-4">
             <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                    <Link href={`/field-tasks/${taskId}`}>
                    <ChevronLeft className="h-5 w-5" />
                    <span className="sr-only">Back</span>
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold flex-1 truncate">{taskData.title}</h1>
            </div>
            
             {isRework && taskData.rejectionReason && (
                <Alert variant="destructive">
                    <RefreshCw className="h-4 w-4" />
                    <AlertTitle>Yêu cầu làm lại</AlertTitle>
                    <AlertDescription>
                        {taskData.rejectionReason}
                    </AlertDescription>
                </Alert>
            )}

            {taskData.criteria.map(criterion => (
                <div key={criterion.id}>
                    <h2 className="font-semibold text-lg mb-2">{criterion.requirement}</h2>
                    {renderCriterion(criterion)}
                </div>
            ))}
            
            <div className="pt-4">
                <Button size="lg" className="w-full" onClick={handleSubmit}>
                    {isRework ? 'Nộp lại Báo cáo' : 'Nộp Báo cáo'}
                </Button>
            </div>
        </div>
    );
}
