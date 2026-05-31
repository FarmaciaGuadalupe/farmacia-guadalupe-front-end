import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { FormattedMessage } from "react-intl";

export default function UserMetaCard() {
	const { isOpen, openModal, closeModal } = useModal();
	const handleSave = () => {
		// Handle save logic here
		console.log("Saving changes...");
		closeModal();
	};
	return (
		<>
			<div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6"></div>
			<Modal
				isOpen={isOpen}
				onClose={closeModal}
				className="max-w-[700px] m-4"
			>
				<div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
					<div className="px-2 pr-14">
						<h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 uppercase">
							<FormattedMessage id="user.profile.editProfileTitle" />
						</h4>
						{/* <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p> */}
					</div>
					<form className="flex flex-col">
						<div className="custom-scrollbar h-[350px] overflow-y-auto px-2 pb-3">
							{/* <div>
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Social Links
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Label>Facebook</Label>
                    <Input
                      type="text"
                      value="https://www.facebook.com/PimjoHQ"
                    />
                  </div>

                  <div>
                    <Label>X.com</Label>
                    <Input type="text" value="https://x.com/PimjoHQ" />
                  </div>

                  <div>
                    <Label>Linkedin</Label>
                    <Input
                      type="text"
                      value="https://www.linkedin.com/company/pimjo"
                    />
                  </div>

                  <div>
                    <Label>Instagram</Label>
                    <Input type="text" value="https://instagram.com/PimjoHQ" />
                  </div>
                </div>
              </div> */}
							<div className="mt-7">
								<h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6 uppercase">
									<FormattedMessage id="user.profile.personalInfo" />
								</h5>

								<div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
									<div className="col-span-2 lg:col-span-1">
										<Label>
											<FormattedMessage id="name" />
										</Label>
										<Input type="text" value="Juan" />
									</div>

									<div className="col-span-2 lg:col-span-1">
										<Label>
											<FormattedMessage id="lastnames" />
										</Label>
										<Input type="text" value="Perez" />
									</div>

									<div className="col-span-2 lg:col-span-1">
										<Label>
											<FormattedMessage id="user" />
										</Label>
										<Input type="text" value="JPEREZ" />
									</div>

									<div className="col-span-2 lg:col-span-1">
										<Label>
											<FormattedMessage id="phone" />
										</Label>
										<Input type="text" value="78787676" />
									</div>

									<div className="col-span-2">
										<Label>
											<FormattedMessage id="user.profile.idNumber" />
										</Label>
										<Input
											type="text"
											value="201-280880-1001P"
										/>
									</div>
								</div>
							</div>
						</div>
						<div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
							<Button
								size="sm"
								variant="outline"
								onClick={closeModal}
							>
								<FormattedMessage id="cancel" />
							</Button>
							<Button size="sm" onClick={handleSave}>
								<FormattedMessage id="user.profile.saveChanges" />
							</Button>
						</div>
					</form>
				</div>
			</Modal>
		</>
	);
}
