// import { Dispatch, SetStateAction } from 'react';
// import { useForm } from 'react-hook-form';
// import * as z from 'zod';
// import { LoadingOutlined } from '@ant-design/icons';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { BigNumber } from 'bignumber.js';
// import { X } from 'lucide-react';
// import { SupportedLedgerTokenSymbol } from '@/01_types/canisters/ledgers';
// import { exponentNumber, isValidNumber } from '@/02_common/data/numbers';
// import { isAccountHex, principal2account } from '@/02_common/ic/account';
// import { isPrincipalText } from '@/02_common/ic/principals';
// import { useTransferByICP, useTransferByOGY } from '@/08_hooks/ledger/transfer';
// import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '../data/form';
// import TokenPrice from '../data/price';
// import message from '../message';
// import { Button } from '../ui/button';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
// import { Input } from '../ui/input';

// type TransferParams = {
//     children: React.ReactNode;
//     symbol?: SupportedLedgerTokenSymbol;
//     isTransferModalOpen: boolean;
//     setIsTransferModalOpen: Dispatch<SetStateAction<boolean>>;
// };
// const getFormSchema = (balance: string, fee: string, decimals: number) => {
//     return z.object({
//         amount: z
//             .string()
//             .nonempty({
//                 message: 'Please enter the amount to transfer',
//             }) // 必须有内容
//             .refine(
//                 (amount) => isValidNumber(amount, 8), // 最大支持 8 位小数的数字
//                 {
//                     message: 'Expected a valid number',
//                 },
//             )
//             .refine(
//                 (amount) => {
//                     const n = Number(amount);
//                     return (
//                         n + Number(exponentNumber(fee, -decimals)) <=
//                         Number(exponentNumber(balance, -decimals))
//                     ); // 余额限制
//                 },
//                 {
//                     message: 'Not sufficient funds',
//                 },
//             )
//             .refine(
//                 (amount) => {
//                     const n = Number(amount);
//                     return 0.0002 <= n && n < 100000; // 范围限制
//                 },
//                 {
//                     message: "Transaction amount can't be lower than 0.0002 or exceed 100000",
//                 },
//             ),
//         principal: z
//             .string()
//             .nonempty({
//                 message: 'Please enter a principal or account id',
//             })
//             .refine(
//                 (target) => isPrincipalText(target) || isAccountHex(target), // 最大支持 8 位小数的数字
//                 {
//                     message: 'Expected a principal or account id',
//                 },
//             ),
//     });
// };

// export default function TransferTokenModal({
//     children,
//     symbol = 'ICP',
//     isTransferModalOpen,
//     setIsTransferModalOpen,
// }: TransferParams) {
//     const { balance, fee, decimals, transfer, transferring } = (() => {
//         switch (symbol) {
//             case 'ICP':
//                 return useTransferByICP();
//             case 'OGY':
//                 return useTransferByOGY();
//         }
//     })();

//     const e8s = balance?.e8s;

//     const form = useForm<{ amount: string; principal: string }>({
//         resolver: zodResolver(getFormSchema(e8s ?? '0', fee ?? '0', decimals ?? 8)),
//     });

//     const onSubmit = (data: { amount: string; principal: string }) => {
//         const { principal } = data;
//         const amount = BigNumber(data.amount)
//             .multipliedBy(10 ** 8)
//             .toString();
//         transfer({
//             to: isPrincipalText(principal) ? principal2account(principal) : principal,
//             amount,
//         })
//             .then((height) => {
//                 if (height) {
//                     message.success(`Transfer successful.`);
//                     form.reset({
//                         amount: '',
//                         principal: '',
//                     });
//                     setIsTransferModalOpen(false);
//                 }
//             })
//             .catch((e) => message.error(`${e}`));
//     };
//     return (
//         <>
//             <Dialog open={isTransferModalOpen} modal={true} key={symbol + 'transferModal'}>
//                 {children}
//                 <DialogContent className="box-content w-[305px] rounded-lg  px-[20px] py-[15px] md:w-[305px]">
//                     <DialogHeader className="flex flex-row items-center justify-between">
//                         <DialogTitle className="font-base font-inter-regular text-base md:text-lg lg:text-xl">
//                             Transfer
//                         </DialogTitle>
//                         <X
//                             className="cursor-pointer text-gray-300 hover:text-black"
//                             onClick={() => {
//                                 setIsTransferModalOpen(false);
//                             }}
//                         />
//                     </DialogHeader>
//                     <Form {...form}>
//                         <form onSubmit={form.handleSubmit(onSubmit)} className="">
//                             <FormField
//                                 control={form.control}
//                                 name="amount"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <span className="flex items-center justify-between">
//                                             <FormControl className="w-11/12">
//                                                 <Input
//                                                     placeholder="0.00"
//                                                     className="h-[42px] rounded-[8px] border-transparent  bg-[#f2f2f2] px-[11px] py-[4px] font-inter-bold text-lg placeholder:text-[#0006] focus:border-black focus-visible:ring-white "
//                                                     {...field}
//                                                     defaultValue={''}
//                                                 />
//                                             </FormControl>
//                                             <span className="ml-[10px] font-inter-bold text-sm">
//                                                 {symbol}
//                                             </span>
//                                         </span>
//                                         <FormDescription>
//                                             <span className="flex">
//                                                 <span className="text-sm text-muted-foreground">
//                                                     balance:
//                                                 </span>
//                                                 <span>
//                                                     <TokenPrice
//                                                         value={{
//                                                             value: e8s,
//                                                             decimals: {
//                                                                 type: 'exponent',
//                                                                 value: 8,
//                                                             },
//                                                             symbol,
//                                                         }}
//                                                     />
//                                                 </span>
//                                             </span>
//                                         </FormDescription>
//                                         <FormMessage className="!mt-0" />
//                                     </FormItem>
//                                 )}
//                             />
//                             <FormField
//                                 control={form.control}
//                                 name="principal"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <span className="flex items-center justify-between">
//                                             <FormControl className="">
//                                                 <Input
//                                                     className="mt-[20px] h-[42px] rounded-[8px] border-transparent  bg-[#f2f2f2] px-[11px] py-[4px] text-sm placeholder:text-[#0006] focus:border-black focus-visible:ring-white "
//                                                     placeholder={
//                                                         'Account ID or principle ID to send'
//                                                     }
//                                                     {...field}
//                                                 />
//                                             </FormControl>
//                                         </span>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />
//                             <Button
//                                 type="submit"
//                                 className="mt-[20px] flex h-12 w-full items-center justify-center rounded-lg bg-black text-lg font-semibold text-white"
//                             >
//                                 Transfer{' '}
//                                 {transferring && (
//                                     <LoadingOutlined className="ml-[10px]" />
//                                 )}
//                             </Button>
//                         </form>
//                     </Form>
//                 </DialogContent>
//             </Dialog>
//         </>
//     );
// }
