<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
  id="Definitions_AsIs"
  targetNamespace="http://example.com/gasification/as-is">

  <bpmn:process id="Process_AsIs" name="Gasification Project - As-Is" isExecutable="false">

    <bpmn:startEvent id="Start_AsIs" name="New opportunity identified"/>
    <bpmn:task id="Task_GatherReq" name="Gather requirements (Sales)"/>
    <bpmn:task id="Task_CostEst" name="Cost estimation (Estimator)"/>
    <bpmn:task id="Task_TechOutline" name="Technical outline (Project Engineer)"/>
    <bpmn:task id="Task_CompileProposal" name="Compile proposal (Sales)"/>
    <bpmn:task id="Task_SendProposal" name="Send proposal to client (Sales)"/>

    <bpmn:exclusiveGateway id="Gw_ProposalApproved" name="Proposal approved?"/>
    <bpmn:task id="Task_ReviseProposal" name="Revise proposal (Sales/Estimator/Engineer)"/>

    <bpmn:task id="Task_DraftContract" name="Draft contract (Legal)"/>
    <bpmn:task id="Task_SendContract" name="Send contract for signing (Legal/Sales)"/>
    <bpmn:exclusiveGateway id="Gw_ContractSigned" name="Contract signed?"/>
    <bpmn:task id="Task_ReviseContract" name="Revise contract (Legal)"/>

    <bpmn:task id="Task_DetailedDesign" name="Detailed design (Project Engineer)"/>
    <bpmn:task id="Task_TechReview" name="Technical review (Technical Dept)"/>
    <bpmn:exclusiveGateway id="Gw_DesignApproved" name="Design approved?"/>
    <bpmn:task id="Task_ReviseDesign" name="Revise design (Project Engineer)"/>

    <bpmn:task id="Task_PlaceOrders" name="Place orders / RFQ / PO (Procurement)"/>
    <bpmn:intermediateCatchEvent id="Timer_AwaitDelivery" name="Await delivery">
      <bpmn:timerEventDefinition/>
    </bpmn:intermediateCatchEvent>

    <bpmn:task id="Task_ScheduleResources" name="Schedule crews & logistics (Dispatcher)"/>
    <bpmn:task id="Task_Construction" name="Construction / installation (Foreman)"/>

    <bpmn:task id="Task_Commissioning" name="Commissioning & testing (Technical Dept)"/>
    <bpmn:exclusiveGateway id="Gw_TestsSuccessful" name="Tests successful?"/>
    <bpmn:task id="Task_Rework" name="Rework / fix issues (Foreman + Technical)"/>

    <bpmn:task id="Task_FinalInvoice" name="Prepare & send final invoice (Finance)"/>
    <bpmn:task id="Task_HandoverDocs" name="Compile handover docs (Project Engineer)"/>
    <bpmn:task id="Task_FinalHandover" name="Final handover & acceptance (Sales/Engineer + Client)"/>

    <bpmn:endEvent id="End_AsIs" name="Project closed"/>

    <!-- Sequence flows -->
    <bpmn:sequenceFlow id="F1" sourceRef="Start_AsIs" targetRef="Task_GatherReq"/>
    <bpmn:sequenceFlow id="F2" sourceRef="Task_GatherReq" targetRef="Task_CostEst"/>
    <bpmn:sequenceFlow id="F3" sourceRef="Task_CostEst" targetRef="Task_TechOutline"/>
    <bpmn:sequenceFlow id="F4" sourceRef="Task_TechOutline" targetRef="Task_CompileProposal"/>
    <bpmn:sequenceFlow id="F5" sourceRef="Task_CompileProposal" targetRef="Task_SendProposal"/>
    <bpmn:sequenceFlow id="F6" sourceRef="Task_SendProposal" targetRef="Gw_ProposalApproved"/>

    <bpmn:sequenceFlow id="F7_Yes" sourceRef="Gw_ProposalApproved" targetRef="Task_DraftContract">
      <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression"><![CDATA[approved]]></bpmn:conditionExpression>
    </bpmn:sequenceFlow>
    <bpmn:sequenceFlow id="F7_No" sourceRef="Gw_ProposalApproved" targetRef="Task_ReviseProposal">
      <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression"><![CDATA[changes_requested]]></bpmn:conditionExpression>
    </bpmn:sequenceFlow>
    <bpmn:sequenceFlow id="F7_Loop" sourceRef="Task_ReviseProposal" targetRef="Task_SendProposal"/>

    <bpmn:sequenceFlow id="F8" sourceRef="Task_DraftContract" targetRef="Task_SendContract"/>
    <bpmn:sequenceFlow id="F9" sourceRef="Task_SendContract" targetRef="Gw_ContractSigned"/>

    <bpmn:sequenceFlow id="F10_Yes" sourceRef="Gw_ContractSigned" targetRef="Task_DetailedDesign">
      <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression"><![CDATA[signed]]></bpmn:conditionExpression>
    </bpmn:sequenceFlow>
    <bpmn:sequenceFlow id="F10_No" sourceRef="Gw_ContractSigned" targetRef="Task_ReviseContract">
      <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression"><![CDATA[needs_revision]]></bpmn:conditionExpression>
    </bpmn:sequenceFlow>
    <bpmn:sequenceFlow id="F10_Loop" sourceRef="Task_ReviseContract" targetRef="Task_SendContract"/>

    <bpmn:sequenceFlow id="F11" sourceRef="Task_DetailedDesign" targetRef="Task_TechReview"/>
    <bpmn:sequenceFlow id="F12" sourceRef="Task_TechReview" targetRef="Gw_DesignApproved"/>

    <bpmn:sequenceFlow id="F13_Yes" sourceRef="Gw_DesignApproved" targetRef="Task_PlaceOrders">
      <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression"><![CDATA[approved]]></bpmn:conditionExpression>
    </bpmn:sequenceFlow>
    <bpmn:sequenceFlow id="F13_No" sourceRef="Gw_DesignApproved" targetRef="Task_ReviseDesign">
      <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression"><![CDATA[rework_required]]></bpmn:conditionExpression>
    </bpmn:sequenceFlow>
    <bpmn:sequenceFlow id="F13_Loop" sourceRef="Task_ReviseDesign" targetRef="Task_TechReview"/>

    <bpmn:sequenceFlow id="F14" sourceRef="Task_PlaceOrders" targetRef="Timer_AwaitDelivery"/>
    <bpmn:sequenceFlow id="F15" sourceRef="Timer_AwaitDelivery" targetRef="Task_ScheduleResources"/>
    <bpmn:sequenceFlow id="F16" sourceRef="Task_ScheduleResources" targetRef="Task_Construction"/>
    <bpmn:sequenceFlow id="F17" sourceRef="Task_Construction" targetRef="Task_Commissioning"/>
    <bpmn:sequenceFlow id="F18" sourceRef="Task_Commissioning" targetRef="Gw_TestsSuccessful"/>

    <bpmn:sequenceFlow id="F19_Yes" sourceRef="Gw_TestsSuccessful" targetRef="Task_FinalInvoice">
      <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression"><![CDATA[pass]]></bpmn:conditionExpression>
    </bpmn:sequenceFlow>
    <bpmn:sequenceFlow id="F19_No" sourceRef="Gw_TestsSuccessful" targetRef="Task_Rework">
      <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression"><![CDATA[fail]]></bpmn:conditionExpression>
    </bpmn:sequenceFlow>
    <bpmn:sequenceFlow id="F19_Loop" sourceRef="Task_Rework" targetRef="Task_Commissioning"/>

    <bpmn:sequenceFlow id="F20" sourceRef="Task_FinalInvoice" targetRef="Task_HandoverDocs"/>
    <bpmn:sequenceFlow id="F21" sourceRef="Task_HandoverDocs" targetRef="Task_FinalHandover"/>
    <bpmn:sequenceFlow id="F22" sourceRef="Task_FinalHandover" targetRef="End_AsIs"/>

  </bpmn:process>
</bpmn:definitions>

